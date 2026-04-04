import cv2
import pickle
import cvzone
import numpy as np
from cvzone.HandTrackingModule import HandDetector

# -------------------- CONFIG --------------------
CAM_WIDTH, CAM_HEIGHT = 1280, 720
WARP_WIDTH, WARP_HEIGHT = 1920, 1080

MAP_FILE = "forest_map.p"
COUNTRIES_FILE = "forest.p"

# -------------------- LOAD DATA --------------------
with open(MAP_FILE, "rb") as f:
    map_points = pickle.load(f)
print("Loaded Map Coordinates")

with open(COUNTRIES_FILE, "rb") as f:
    polygons = pickle.load(f)
print(f"Loaded {len(polygons)} regions")

# -------------------- CAMERA --------------------
cap = cv2.VideoCapture(1)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, CAM_WIDTH)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, CAM_HEIGHT)

# -------------------- HAND DETECTOR --------------------
detector = HandDetector(maxHands=1, detectionCon=0.5, minTrackCon=0.5)

# -------------------- FUNCTIONS --------------------
def warp_image(img, points):
    pts1 = np.float32(points)
    pts2 = np.float32([
        [0, 0],
        [WARP_WIDTH, 0],
        [0, WARP_HEIGHT],
        [WARP_WIDTH, WARP_HEIGHT]
    ])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    warped = cv2.warpPerspective(img, matrix, (WARP_WIDTH, WARP_HEIGHT))
    return warped, matrix


def warp_single_point(point, matrix):
    point_h = np.array([[point[0], point[1], 1]], dtype=np.float32)
    transformed = matrix @ point_h.T
    transformed = transformed.T
    return transformed[0][:2] / transformed[0][2]


def get_finger_location(img, matrix):
    hands = detector.findHands(img, draw=False)
    if hands:
        hand = hands[0]
        index_finger = hand["lmList"][8][:2]
        cv2.circle(img, index_finger, 6, (255, 0, 255), cv2.FILLED)
        wp = warp_single_point(index_finger, matrix)
        return int(wp[0]), int(wp[1])
    return None


def draw_selected_region(polygons, point):
    output = np.zeros((WARP_HEIGHT, WARP_WIDTH, 3), dtype=np.uint8)

    for polygon, name in polygons:
        poly_np = np.array(polygon, np.int32)
        if cv2.pointPolygonTest(poly_np, point, False) >= 0:
            cv2.fillPoly(output, [poly_np], (0, 180, 0))
            cv2.polylines(output, [poly_np], True, (0, 255, 0), 3)

            cvzone.putTextRect(
                output,
                name,
                (50, 80),
                scale=2,
                thickness=3
            )
            break  # show only ONE selected region

    return output


# -------------------- MAIN LOOP --------------------
while True:
    success, img = cap.read()
    if not success:
        break

    # Mirror camera for natural interaction
    img = cv2.flip(img, 1)

    # Warp camera to map space
    _, matrix = warp_image(img, map_points)

    # Get finger position
    warped_point = get_finger_location(img, matrix)

    # Create map view
    if warped_point:
        map_view = draw_selected_region(polygons, warped_point)
    else:
        map_view = np.zeros((WARP_HEIGHT, WARP_WIDTH, 3), dtype=np.uint8)

    # Resize for display
    cam_view = cv2.resize(img, (640, 480))
    map_view = cv2.resize(map_view, (640, 480))

    # Show ONLY TWO WINDOWS
    cv2.imshow("Camera View", cam_view)
    cv2.imshow("Map View (Selected Region)", map_view)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# -------------------- CLEANUP --------------------
cap.release()
cv2.destroyAllWindows()
