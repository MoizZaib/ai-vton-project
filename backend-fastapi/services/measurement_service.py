"""
Body Measurement Service using MediaPipe Pose Landmarker (New API)
Extracts upper body measurements from user images
"""

import cv2
import numpy as np
import math
import os
import urllib.request
from typing import Optional, Dict, Tuple
from models.schemas import UserMeasurement, FitDetail, FitReport

# Import MediaPipe Tasks
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision


class MeasurementService:
    """
    Service for extracting body measurements using MediaPipe Pose Landmarker
    and comparing with product sizes
    """
    
    # Pose landmark indices (from MediaPipe Pose Landmarker)
    NOSE = 0
    LEFT_EYE_INNER = 1
    LEFT_EYE = 2
    LEFT_EYE_OUTER = 3
    RIGHT_EYE_INNER = 4
    RIGHT_EYE = 5
    RIGHT_EYE_OUTER = 6
    LEFT_EAR = 7
    RIGHT_EAR = 8
    MOUTH_LEFT = 9
    MOUTH_RIGHT = 10
    LEFT_SHOULDER = 11
    RIGHT_SHOULDER = 12
    LEFT_ELBOW = 13
    RIGHT_ELBOW = 14
    LEFT_WRIST = 15
    RIGHT_WRIST = 16
    LEFT_HIP = 23
    RIGHT_HIP = 24
    
    def __init__(self):
        """Initialize MediaPipe Pose Landmarker"""
        # Reference scaling factors
        # Average face width is approximately 5.5-6.5 inches
        self.REFERENCE_FACE_WIDTH_INCHES = 6.0
        
        # Body proportion multipliers for estimation
        # These are approximate and can be calibrated
        self.CHEST_MULTIPLIER = 2.2  # Chest is typically 2.2x shoulder width for estimation
        
        # Download model if not exists
        self.model_path = self._ensure_model_exists()

    def get_measurements_from_image(self, image_bytes: bytes, user_height_inches: Optional[float] = None) -> Dict:
        """
        Process image bytes and extract measurements.
        This is the main entry point for the API.
        
        Args:
            image_bytes: Raw image bytes from upload
            user_height_inches: Optional user height for calibration
            
        Returns:
            Dictionary with success status, measurements, and confidence
        """
        import tempfile
        
        try:
            # Save bytes to temp file
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
                tmp.write(image_bytes)
                tmp_path = tmp.name
            
            # Extract measurements
            result = self.extract_measurements(tmp_path, user_height_inches)
            
            # Clean up temp file
            try:
                os.remove(tmp_path)
            except:
                pass
            
            # Check if measurement was successful
            if result.shoulder == 0.0 and result.chest == 0.0:
                return {
                    "success": False,
                    "error": result.message
                }
            
            return {
                "success": True,
                "measurements": {
                    "shoulder": result.shoulder,
                    "chest": result.chest,
                    "sleeve": result.sleeve,
                    "neck": result.neck,
                    "length": result.length
                },
                "confidence": result.confidence,
                "calibration": "height" if user_height_inches else "face",
                "message": result.message
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to process image: {str(e)}"
            }

    def _ensure_model_exists(self) -> str:
        """Download the pose landmarker model if it doesn't exist"""
        model_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
        os.makedirs(model_dir, exist_ok=True)
        
        model_path = os.path.join(model_dir, 'pose_landmarker_heavy.task')
        
        if not os.path.exists(model_path):
            print("Downloading pose landmarker model...")
            model_url = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task"
            try:
                urllib.request.urlretrieve(model_url, model_path)
                print("Model downloaded successfully!")
            except Exception as e:
                print(f"Failed to download model: {e}")
                # Try lite model as fallback
                model_path = os.path.join(model_dir, 'pose_landmarker_lite.task')
                if not os.path.exists(model_path):
                    lite_url = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task"
                    urllib.request.urlretrieve(lite_url, model_path)
        
        return model_path
    
    def _calculate_distance(self, point1: Tuple[float, float], point2: Tuple[float, float]) -> float:
        """Calculate Euclidean distance between two points"""
        return math.sqrt((point2[0] - point1[0])**2 + (point2[1] - point1[1])**2)
    
    def _get_landmark_coords(self, landmarks, index: int, image_width: int, image_height: int) -> Optional[Tuple[float, float]]:
        """Extract x, y coordinates from a landmark"""
        if index >= len(landmarks):
            return None
        landmark = landmarks[index]
        # Check visibility if available
        visibility = getattr(landmark, 'visibility', 1.0)
        if visibility < 0.5:
            return None
        return (landmark.x * image_width, landmark.y * image_height)
    
    def _estimate_face_width(self, landmarks, image_width: int, image_height: int) -> Optional[float]:
        """
        Estimate face width using eye distance or ear distance
        This is used as a reference for pixel-to-inch conversion
        """
        # Try using ear to ear distance first
        left_ear = self._get_landmark_coords(landmarks, self.LEFT_EAR, image_width, image_height)
        right_ear = self._get_landmark_coords(landmarks, self.RIGHT_EAR, image_width, image_height)
        
        if left_ear and right_ear:
            ear_distance = self._calculate_distance(left_ear, right_ear)
            # Ear-to-ear is approximately face width
            return ear_distance
        
        # Fallback to eye distance (face width is approximately 2x inter-eye distance)
        left_eye = self._get_landmark_coords(landmarks, self.LEFT_EYE, image_width, image_height)
        right_eye = self._get_landmark_coords(landmarks, self.RIGHT_EYE, image_width, image_height)
        
        if left_eye and right_eye:
            eye_distance = self._calculate_distance(left_eye, right_eye)
            # Inter-pupillary distance is about 2.5 inches, face is about 6 inches
            return eye_distance * 2.4
        
        return None
    
    def _pixels_to_inches(self, pixels: float, reference_pixels: float, reference_inches: float) -> float:
        """Convert pixel measurement to inches using a reference measurement"""
        if reference_pixels <= 0:
            return 0.0
        ratio = reference_inches / reference_pixels
        return pixels * ratio
    
    def _detect_loose_clothing(self, landmarks, image_width: int, image_height: int) -> Tuple[bool, str]:
        """
        Detect if person might be wearing loose/oversized clothing
        Uses body proportion analysis to detect unusual ratios
        
        Returns: (is_loose_clothing_detected, warning_message)
        """
        # Get key body points
        left_shoulder = self._get_landmark_coords(landmarks, self.LEFT_SHOULDER, image_width, image_height)
        right_shoulder = self._get_landmark_coords(landmarks, self.RIGHT_SHOULDER, image_width, image_height)
        left_hip = self._get_landmark_coords(landmarks, self.LEFT_HIP, image_width, image_height)
        right_hip = self._get_landmark_coords(landmarks, self.RIGHT_HIP, image_width, image_height)
        nose = self._get_landmark_coords(landmarks, self.NOSE, image_width, image_height)
        
        if not all([left_shoulder, right_shoulder, left_hip, right_hip, nose]):
            return False, ""
        
        # Calculate proportions
        shoulder_width = self._calculate_distance(left_shoulder, right_shoulder)
        hip_width = self._calculate_distance(left_hip, right_hip)
        
        # Get face/head width for reference
        face_width = self._estimate_face_width(landmarks, image_width, image_height)
        if not face_width or face_width < 20:
            return False, ""
        
        # Normal shoulder-to-face ratio is typically 2.5-3.5x
        shoulder_to_face_ratio = shoulder_width / face_width
        
        # Normal shoulder-to-hip ratio is typically 1.0-1.4 for adults
        shoulder_to_hip_ratio = shoulder_width / hip_width if hip_width > 0 else 0
        
        warnings = []
        
        # If shoulders appear much wider than expected (loose top/jacket)
        if shoulder_to_face_ratio > 4.0:
            warnings.append("shoulders appear unusually wide (possibly loose/padded clothing)")
        
        # If hip appears much wider than shoulders (loose pants/dress)
        if shoulder_to_hip_ratio < 0.7:
            warnings.append("lower body appears wider than expected (possibly loose clothing)")
        
        # If shoulders appear too narrow compared to face (very baggy hiding shoulders)
        if shoulder_to_face_ratio < 2.0:
            warnings.append("shoulder definition is unclear (clothing may be hiding body shape)")
        
        if warnings:
            return True, "⚠️ Loose/oversized clothing detected: " + "; ".join(warnings) + ". For accurate measurements, please wear fitted clothing."
        
        return False, ""

    def _get_body_height_pixels(self, landmarks, image_width: int, image_height: int) -> Optional[float]:
        """
        Calculate approximate body height in pixels from top of head to ankles
        """
        # Get nose as proxy for top of head
        nose = self._get_landmark_coords(landmarks, self.NOSE, image_width, image_height)
        
        # Get ankles - use index 27 (LEFT_ANKLE) and 28 (RIGHT_ANKLE)
        LEFT_ANKLE = 27
        RIGHT_ANKLE = 28
        left_ankle = self._get_landmark_coords(landmarks, LEFT_ANKLE, image_width, image_height)
        right_ankle = self._get_landmark_coords(landmarks, RIGHT_ANKLE, image_width, image_height)
        
        if nose and (left_ankle or right_ankle):
            ankle = left_ankle if left_ankle else right_ankle
            # Add ~8% for top of head (nose to top of head)
            head_to_nose = (ankle[1] - nose[1]) * 0.08
            return (ankle[1] - nose[1]) + head_to_nose
        
        return None

    def extract_measurements(self, image_path: str, user_height_inches: Optional[float] = None) -> UserMeasurement:
        """
        Extract body measurements from an image using MediaPipe Pose Landmarker
        
        Returns measurements in inches (estimated based on face width reference)
        """
        # Read image
        image = cv2.imread(image_path)
        if image is None:
            return UserMeasurement(
                shoulder=0.0,
                chest=0.0,
                confidence=0.0,
                message="Failed to load image"
            )
        
        image_height, image_width = image.shape[:2]
        
        # Convert BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        try:
            # Create Pose Landmarker
            base_options = python.BaseOptions(model_asset_path=self.model_path)
            options = vision.PoseLandmarkerOptions(
                base_options=base_options,
                output_segmentation_masks=False,
                running_mode=vision.RunningMode.IMAGE
            )
            
            with vision.PoseLandmarker.create_from_options(options) as landmarker:
                # Create MediaPipe Image
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)
                
                # Detect pose
                result = landmarker.detect(mp_image)
                
                if not result.pose_landmarks or len(result.pose_landmarks) == 0:
                    return UserMeasurement(
                        shoulder=0.0,
                        chest=0.0,
                        confidence=0.0,
                        message="❌ No person detected in the image. Please upload a photo where you are clearly visible from head to waist."
                    )
                
                # Get the first detected pose
                landmarks = result.pose_landmarks[0]
                
                # Determine reference for pixel-to-inch conversion
                reference_pixels = None
                reference_inches = None
                calibration_method = "face"
                confidence_boost = 0
                
                # Priority 1: Use user-provided height (most accurate)
                if user_height_inches:
                    body_height_pixels = self._get_body_height_pixels(landmarks, image_width, image_height)
                    if body_height_pixels and body_height_pixels > 100:
                        reference_pixels = body_height_pixels
                        reference_inches = user_height_inches
                        calibration_method = "height"
                        confidence_boost = 15  # Height calibration is more accurate
                
                # Priority 2: Use face width (fallback)
                if not reference_pixels:
                    face_width_pixels = self._estimate_face_width(landmarks, image_width, image_height)
                    if face_width_pixels and face_width_pixels > 30:
                        reference_pixels = face_width_pixels
                        reference_inches = self.REFERENCE_FACE_WIDTH_INCHES
                        calibration_method = "face"
                
                # No valid reference found
                if not reference_pixels:
                    return UserMeasurement(
                        shoulder=0.0,
                        chest=0.0,
                        confidence=0.0,
                        message="❌ Cannot detect your face clearly. Please ensure your face is visible in the photo, or provide your height for better accuracy."
                    )
                
                # Validate body landmarks
                left_shoulder = self._get_landmark_coords(landmarks, self.LEFT_SHOULDER, image_width, image_height)
                right_shoulder = self._get_landmark_coords(landmarks, self.RIGHT_SHOULDER, image_width, image_height)
                
                if not left_shoulder or not right_shoulder:
                    return UserMeasurement(
                        shoulder=0.0,
                        chest=0.0,
                        confidence=0.0,
                        message="❌ Cannot detect shoulders. Please ensure your upper body is fully visible and facing the camera."
                    )
                
                # Check if person is facing camera (shoulders should be visible width)
                shoulder_distance = self._calculate_distance(left_shoulder, right_shoulder)
                if shoulder_distance < 40:
                    return UserMeasurement(
                        shoulder=0.0,
                        chest=0.0,
                        confidence=0.0,
                        message="❌ It looks like you're standing sideways. Please face the camera directly."
                    )
                
                # Check for loose/oversized clothing
                is_loose_clothing, loose_clothing_warning = self._detect_loose_clothing(landmarks, image_width, image_height)
                
                # Extract other body points
                
                # Extract hip points for torso length
                left_hip = self._get_landmark_coords(landmarks, self.LEFT_HIP, image_width, image_height)
                right_hip = self._get_landmark_coords(landmarks, self.RIGHT_HIP, image_width, image_height)
                
                # Extract elbow and wrist for sleeve
                left_elbow = self._get_landmark_coords(landmarks, self.LEFT_ELBOW, image_width, image_height)
                left_wrist = self._get_landmark_coords(landmarks, self.LEFT_WRIST, image_width, image_height)
                right_elbow = self._get_landmark_coords(landmarks, self.RIGHT_ELBOW, image_width, image_height)
                right_wrist = self._get_landmark_coords(landmarks, self.RIGHT_WRIST, image_width, image_height)
                
                # Calculate measurements
                measurements = {
                    "shoulder": None,
                    "chest": None,
                    "sleeve": None,
                    "neck": None,
                    "length": None
                }
                
                confidence_count = 0
                total_points = 0
                
                # Shoulder width
                if left_shoulder and right_shoulder:
                    shoulder_pixels = self._calculate_distance(left_shoulder, right_shoulder)
                    measurements["shoulder"] = round(self._pixels_to_inches(shoulder_pixels, reference_pixels, reference_inches), 1)
                    confidence_count += 1
                total_points += 1
                
                # Chest estimation (shoulder width * multiplier)
                # In reality, chest measurement requires a side view or depth sensor
                # This is an approximation based on body proportions
                if measurements["shoulder"]:
                    measurements["chest"] = round(measurements["shoulder"] * self.CHEST_MULTIPLIER, 1)
                    confidence_count += 1
                total_points += 1
                
                # Sleeve length (shoulder to wrist via elbow)
                sleeve_pixels = 0
                if left_shoulder and left_elbow:
                    sleeve_pixels += self._calculate_distance(left_shoulder, left_elbow)
                if left_elbow and left_wrist:
                    sleeve_pixels += self._calculate_distance(left_elbow, left_wrist)
                
                # Try right side if left side not available
                if sleeve_pixels == 0:
                    if right_shoulder and right_elbow:
                        sleeve_pixels += self._calculate_distance(right_shoulder, right_elbow)
                    if right_elbow and right_wrist:
                        sleeve_pixels += self._calculate_distance(right_elbow, right_wrist)
                
                if sleeve_pixels > 0:
                    measurements["sleeve"] = round(self._pixels_to_inches(sleeve_pixels, reference_pixels, reference_inches), 1)
                    confidence_count += 1
                total_points += 1
                
                # Torso length (shoulder to hip)
                if left_shoulder and left_hip:
                    length_pixels = self._calculate_distance(left_shoulder, left_hip)
                    measurements["length"] = round(self._pixels_to_inches(length_pixels, reference_pixels, reference_inches), 1)
                    confidence_count += 1
                elif right_shoulder and right_hip:
                    length_pixels = self._calculate_distance(right_shoulder, right_hip)
                    measurements["length"] = round(self._pixels_to_inches(length_pixels, reference_pixels, reference_inches), 1)
                    confidence_count += 1
                total_points += 1
                
                # Neck estimation (approximately 14-16 inches circumference for adults)
                # Use shoulder width as reference (neck is ~40% of shoulder width for circumference)
                if measurements["shoulder"]:
                    measurements["neck"] = round(measurements["shoulder"] * 0.85, 1)  # Approximate neck circumference
                    confidence_count += 1
                total_points += 1
                
                # Calculate confidence score
                base_confidence = round((confidence_count / total_points) * 100, 1)
                confidence = min(base_confidence + confidence_boost, 100.0)
                
                # Reduce confidence if loose clothing detected
                if is_loose_clothing:
                    confidence = max(confidence - 20, 40.0)  # Reduce confidence for loose clothing
                
                # Build success message based on calibration method and warnings
                if is_loose_clothing:
                    message = loose_clothing_warning
                elif calibration_method == "height":
                    message = f"✅ Excellent! Using your height for accurate measurements ({confidence}% confidence)"
                elif confidence >= 80:
                    message = f"✅ Great photo quality! ({confidence}% confidence)"
                elif confidence >= 60:
                    message = f"✓ Good measurement ({confidence}% confidence). Tip: Enter your height for better accuracy."
                else:
                    message = f"⚠️ Measurements may be less accurate ({confidence}% confidence). Try adding your height."
                
                return UserMeasurement(
                    shoulder=measurements["shoulder"] or 0.0,
                    chest=measurements["chest"] or 0.0,
                    sleeve=measurements["sleeve"],
                    neck=measurements["neck"],
                    length=measurements["length"],
                    confidence=confidence,
                    message=message
                )
                
        except Exception as e:
            return UserMeasurement(
                shoulder=0.0,
                chest=0.0,
                confidence=0.0,
                message=f"Error processing image: {str(e)}"
            )
    
    def _get_fit_status(self, difference: float) -> Tuple[str, str]:
        """
        Determine fit status based on difference between user and product
        
        Returns: (status, description)
        """
        if difference < -2:
            status = "Tight"
            description = f"Tight by {abs(difference):.1f} inches"
        elif difference > 2:
            status = "Loose"
            description = f"Loose by {difference:.1f} inches"
        else:
            status = "Normal"
            if difference > 0:
                description = f"Good fit (+{difference:.1f} inches room)"
            elif difference < 0:
                description = f"Good fit ({difference:.1f} inches snug)"
            else:
                description = "Perfect fit"
        
        return status, description
    
    def generate_fit_report(
        self,
        user_measurements: Dict[str, Optional[float]],
        product_measurements: Dict[str, Optional[float]]
    ) -> FitReport:
        """
        Generate a detailed fit report comparing user measurements to product
        """
        fit_details = {}
        fit_statuses = []
        
        # Compare shoulder
        if user_measurements.get("shoulder") and product_measurements.get("shoulder"):
            diff = product_measurements["shoulder"] - user_measurements["shoulder"]
            status, description = self._get_fit_status(diff)
            fit_details["shoulder_fit"] = FitDetail(
                difference=round(diff, 1),
                status=status,
                description=description
            )
            fit_statuses.append(status)
        
        # Compare chest
        if user_measurements.get("chest") and product_measurements.get("chest"):
            diff = product_measurements["chest"] - user_measurements["chest"]
            status, description = self._get_fit_status(diff)
            fit_details["chest_fit"] = FitDetail(
                difference=round(diff, 1),
                status=status,
                description=description
            )
            fit_statuses.append(status)
        
        # Compare sleeve
        if user_measurements.get("sleeve") and product_measurements.get("sleeve"):
            diff = product_measurements["sleeve"] - user_measurements["sleeve"]
            status, description = self._get_fit_status(diff)
            fit_details["sleeve_fit"] = FitDetail(
                difference=round(diff, 1),
                status=status,
                description=description
            )
            fit_statuses.append(status)
        
        # Compare neck
        if user_measurements.get("neck") and product_measurements.get("neck"):
            diff = product_measurements["neck"] - user_measurements["neck"]
            status, description = self._get_fit_status(diff)
            fit_details["neck_fit"] = FitDetail(
                difference=round(diff, 1),
                status=status,
                description=description
            )
            fit_statuses.append(status)
        
        # Compare length
        if user_measurements.get("length") and product_measurements.get("length"):
            diff = product_measurements["length"] - user_measurements["length"]
            status, description = self._get_fit_status(diff)
            fit_details["length_fit"] = FitDetail(
                difference=round(diff, 1),
                status=status,
                description=description
            )
            fit_statuses.append(status)
        
        # Determine overall fit
        if not fit_statuses:
            overall = "Unable to compare"
            recommendation = "Insufficient measurement data"
        else:
            tight_count = fit_statuses.count("Tight")
            loose_count = fit_statuses.count("Loose")
            normal_count = fit_statuses.count("Normal")
            
            if tight_count > len(fit_statuses) / 2:
                overall = "Too Tight"
                recommendation = "Consider a larger size"
            elif loose_count > len(fit_statuses) / 2:
                overall = "Too Loose"
                recommendation = "Consider a smaller size"
            elif tight_count > 0 and loose_count > 0:
                overall = "Mixed Fit"
                recommendation = "This size may work, but check specific measurements"
            else:
                overall = "Good Fit"
                recommendation = "Recommended: Normal Fit"
        
        return FitReport(
            shoulder_fit=fit_details.get("shoulder_fit"),
            chest_fit=fit_details.get("chest_fit"),
            sleeve_fit=fit_details.get("sleeve_fit"),
            neck_fit=fit_details.get("neck_fit"),
            length_fit=fit_details.get("length_fit"),
            overall=overall,
            recommendation=recommendation
        )
