import cv2
import numpy as np
import pickle

# Camera settings
width, height = 1920, 1000

# Initialize variables
cap = cv2.VideoCapture(1)
cap.set(3, width)
cap.set(4, height)

points = np.zeros((4, 2), int)
counter = 0

def mousePoints(event, x, y, flags, params):
    global counter
    if event == cv2.EVENT_LBUTTONDOWN:
        if counter < 4:
            points[counter] = x, y
            counter += 1
            print(f"Clicked Points: {points}")

def warp_image(img, points, size=[1920, 1080]):
    pts1 = np.float32(points)
    pts2 = np.float32([
        [0, 0],
        [size[0], 0],
        [0, size[1]],
        [size[0], size[1]]
    ])
    matrix = cv2.getPerspectiveTransform(pts1, pts2)
    imgOutput = cv2.warpPerspective(img, matrix, (size[0], size[1]))
    return imgOutput, matrix

while True:
    success, img = cap.read()
    if not success:
        break

    # 🔹 FLIP IMAGE (mirror view)
    img = cv2.flip(img, 1)

    if counter == 4:
        with open("forest_map.p", "wb") as fileObj:
            pickle.dump(points, fileObj)
        print("Points saved to file map.p")

        imgOutput, matrix = warp_image(img, points)
        cv2.imshow("Output Image", imgOutput)

    for i in range(min(counter, 4)):
        cv2.circle(img, (points[i][0], points[i][1]), 5, (0, 255, 0), cv2.FILLED)

    cv2.imshow("Original Image", img)
    cv2.setMouseCallback("Original Image", mousePoints)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
