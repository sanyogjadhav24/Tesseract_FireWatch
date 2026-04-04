# FIREWATCH

An AI-powered forest fire detection, prediction, and response platform.

## Description

Forests do not scream, but they whisper. FIREWATCH is designed to hear those whispers before they become disasters.

FIREWATCH combines AI, machine learning, IoT mesh networking, and existing surveillance hardware to detect early fire indicators such as heat anomalies, smoke, gas concentration, and visual warning signals. The system is built to reduce detection delay, improve reporting quality, and support faster mitigation.

## Problem Statement

Forest fires must be detected within a critical time window. If detection is delayed, control becomes extremely difficult.

Today, many wildfire incidents remain undetected in their early stages. This causes major damage to:

- Wildlife
- Vegetation
- Human life
- Public and private property

In India, approximately 100,000 hectares of forest are affected by natural fires every year. Existing systems are often manual and reactive, with little or no technology-assisted early warning.

## Why Existing Solutions Fall Short

Current approaches in many regions depend heavily on manual observation and delayed reporting. Without intelligent sensing, prediction, and real-time communication, response starts late and fire spread accelerates.

## Our Solution: FIREWATCH

FIREWATCH is an intelligent, proactive solution supported by:

- AI and ML models for detection and prediction
- IoT mesh sensor networks for resilience and continuity
- Existing CCTV infrastructure enhanced with computer vision
- Multi-channel alerting for citizens and authorities

The platform is structured around a three-pronged approach.

## 1) Detection and Prediction

FIREWATCH integrates methane, carbon monoxide, and gas sensors with advanced ML models to detect and predict fire risk.

- Sensor data tracks environmental risk factors in real time.
- ML models identify early-stage fire patterns and anomalies.
- A mesh network architecture allows nodes to relay alerts even if one node fails due to fire damage.

This provides robust, fault-tolerant early warning to authorities.

## 2) Alerting and Reporting

FIREWATCH supports three reporting methods:

1. Manual reporting through an Android app:
	- Capture evidence using device camera
	- Attach key fire details (description, priority, location)
	- Auto location detection
	- Two-tier submission flow with AI-based validation before final report submission

2. Automated CCTV-based detection:
	- YOLOv8 models deployed on existing CCTV feeds
	- Automated smoke intensity monitoring and fire event detection

3. Mapboard gesture-based reporting for low-connectivity zones:
	- If users do not have the app or network is weak, they can point to the location on a physical map/mapboard in the sanctuary
	- The system detects the action, maps the location, and forwards the report to authorities

## 3) Mitigation and Awareness

FIREWATCH also focuses on preparedness:

- Public awareness of early fire reporting and safety behavior
- Training support for officials and forest staff
- Incident simulation exercises to demonstrate correct response using the FIREWATCH system

## Project Goal

Build an advanced, effective, and scalable forest fire intelligence system that shifts fire management from reactive response to proactive prevention.

## Local Development

Run the project locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.
