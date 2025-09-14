// Global variables
let video;
let canvas;
let ctx;
let handpose;
let model;
let isCameraOn = false;

// Supported gestures and their translations
const gestures = {
    'thumbs_up': 'Hello / Good',
    'thumbs_down': 'No / Bad',
    'victory_hand': 'Peace / Victory',
    'i_love_you_hand': 'I Love You',
    'wave': 'Hello / Goodbye'
};

// Initialize the application
async function init() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    // Load the Handpose model
    try {
        console.log('Loading Handpose model...');
        model = await handpose.load();
        console.log('Model loaded successfully!');
        document.getElementById('startBtn').disabled = false;
    } catch (error) {
        console.error('Error loading model:', error);
        alert('Error loading AI model. Please check console for details.');
    }
    
    // Set up event listeners
    document.getElementById('startBtn').addEventListener('click', startCamera);
    document.getElementById('predictBtn').addEventListener('click', predictSign);
}

// Start camera function
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480 } 
        });
        video.srcObject = stream;
        isCameraOn = true;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('predictBtn').disabled = false;
        document.getElementById('startBtn').textContent = 'Camera Active';
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Cannot access camera. Please check permissions.');
    }
}

// Predict sign function
async function predictSign() {
    if (!isCameraOn) {
        alert('Please start the camera first!');
        return;
    }

    try {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, 640, 480);
        
        // Get predictions from Handpose model
        const predictions = await model.estimateHands(canvas);
        
        if (predictions.length > 0) {
            // Simple gesture recognition based on hand landmarks
            const gesture = recognizeGesture(predictions[0]);
            const translation = gestures[gesture] || 'Sign not recognized';
            
            // Display translation
            document.getElementById('translation').textContent = translation;
            document.getElementById('translation').style.color = '#2d3748';
            
        } else {
            document.getElementById('translation').textContent = 'No hand detected. Please try again.';
            document.getElementById('translation').style.color = '#e53e3e';
        }
    } catch (error) {
        console.error('Error during prediction:', error);
        document.getElementById('translation').textContent = 'Error processing sign. Please try again.';
        document.getElementById('translation').style.color = '#e53e3e';
    }
}

// Simple gesture recognition function
function recognizeGesture(prediction) {
    // This is a simplified example. Real implementation would require
    // more complex logic using the hand landmark positions
    const landmarks = prediction.landmarks;
    
    // Simple logic based on finger positions
    // In a real project, you would use machine learning here
    if (isThumbsUp(landmarks)) return 'thumbs_up';
    if (isThumbsDown(landmarks)) return 'thumbs_down';
    if (isVictory(landmarks)) return 'victory_hand';
    if (isILoveYou(landmarks)) return 'i_love_you_hand';
    if (isWaving(landmarks)) return 'wave';
    
    return 'unknown';
}

// Placeholder functions for gesture recognition
function isThumbsUp(landmarks) { return Math.random() > 0.5; }
function isThumbsDown(landmarks) { return Math.random() > 0.7; }
function isVictory(landmarks) { return Math.random() > 0.6; }
function isILoveYou(landmarks) { return Math.random() > 0.8; }
function isWaving(landmarks) { return Math.random() > 0.4; }

// Start the application when page loads
window.addEventListener('DOMContentLoaded', init);
