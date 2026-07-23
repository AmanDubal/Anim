# Ms. Bangera Portfolio

A high-performance, scroll-driven cinematic portfolio experience featuring 2,354 pre-rendered frames that animate in sync with scroll position. This project demonstrates advanced web performance optimization, canvas rendering, and interactive storytelling through immersive animation.

## Overview

This is not a traditional portfolio—it's a **cinematic experience**. As you scroll, you descend through a cave-like journey while learning about Alex Carter's work, skills, and creative philosophy. Each frame is precisely timed to create a seamless visual narrative.

## Features

- **2,354 Frame Animation**: Pre-rendered 60fps sequences triggered by scroll position
- **Lazy Loading System**: Smart frame preloading with loading bar feedback
- **Performance Optimized**: DPR-aware canvas rendering, clamped to 1.5x for device efficiency
- **Responsive Design**: Fully responsive layout with mobile-first approach
- **Dark Cinematic Theme**: Custom color palette with glowing accents and vignette effects
- **Smooth Scrolling**: Exponential smoothing (0.12 factor) for fluid frame transitions
- **Scene Markers**: 8 distinct sections with parallax narrative content
- **HUD Display**: Real-time depth progress indicator and character name

## Project Structure

```
├── index.html       # HTML structure with scene markers and canvas setup
├── script.js        # Frame animation logic and scroll handling
├── style.css        # Responsive styling with CSS variables
└── Frames/          # 2,354 pre-rendered JPG frames (frame-0001.jpg to frame-2354.jpg)
```

## Technical Details

### Canvas Rendering
- Canvas element automatically scales to window size with device pixel ratio awareness
- DPR capped at 1.5x to maintain performance on ultra-high DPI displays
- Frame drawing only occurs when frame index changes (prevents redundant renders)

### Frame Preloading
- Asynchronous batch loading of all 2,354 frames
- Animation starts after 20 frames are loaded (responsive UX)
- Full preload completion removes loading indicator
- Error handling for missing frames with console logging

### Scroll System
- Scroll position maps to frame index via scene markers
- Exponential smoothing creates cinematic motion blur effect
- Progress tracking updates HUD depth percentage
- Continuous RAF animation loop for smooth playback

### Color Scheme
```css
--bg: #00050b              /* Deep space black */
--text: #f5faff            /* Bright white */
--muted: #cfe0ee           /* Muted blue-gray */
--line: rgba(255,255,255,0.18)  /* Subtle dividers */
--accent: #7fd8ff          /* Bright cyan */
--accent-2: #9effc7        /* Neon green */
```

## Getting Started

### Installation

1. Clone or download this repository
2. Ensure all frame files are present in the `Frames/` directory
3. Serve via HTTP (required for proper image loading)

### Usage

```bash
# Option 1: Using Python's built-in server
python -m http.server 8000

# Option 2: Using Node.js http-server
npx http-server

# Option 3: Using VS Code Live Server
# Right-click index.html and select "Open with Live Server"
```

Then open `http://localhost:8000` in your browser and scroll to experience the journey.

### Configuration

Edit the `CONFIG` object in `script.js` to customize behavior:

```javascript
const CONFIG = {
    frameCount: 2354,      // Total number of frames
    startFrame: 1,         // First frame number
    extension: "jpg",      // Image format
    folder: "Frames",      // Frame directory
    smoothing: 0.12,       // Motion smoothing (0-1, lower = smoother)
    maxDpr: 1.5,          // Maximum device pixel ratio
};
```

## Scenes

The portfolio is divided into 8 narrative sections:

1. **Intro** - "Cinematic Frontend Experiences"
2. **About** - Professional background and vision
3. **Philosophy** - Design and engineering approach
4. **Skills** - Technical stack (HTML5, CSS3, JS, React, Three.js, etc.)
5. **Experience** - Career history and timeline
6. **Process** - Design methodology
7. **Projects** - Portfolio highlights
8. **Recognition** - Awards and features

Each scene is triggered at a specific scroll depth and overlays narrative content on the animated background.

## Performance Considerations

- **Frame Size**: Optimize JPG quality vs. file size (current setup uses ~2354 frames)
- **Preloading**: First 20 frames load before animation starts
- **Canvas Updates**: Only redraws when frame index changes
- **DPR Capping**: Prevents excessive GPU load on ultra-high DPI displays
- **Smooth Scrolling**: Exponential averaging reduces frame skipping

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Requires `canvas` and `requestAnimationFrame` support

## Dependencies

None! This is vanilla JavaScript—no frameworks or libraries required.

## Customization

### Modifying Content

Edit the scene content in `index.html`:

```html
<section class="scene-marker" data-scene="1">
    <div class="scene-content">
        <h2>Your Title</h2>
        <p>Your content here</p>
    </div>
</section>
```

### Adjusting Animation Speed

Modify the `smoothing` value in `script.js`:
- Lower values (0.05) = smoother, slower transitions
- Higher values (0.3) = snappier, more responsive

### Changing Colors

Edit CSS variables in `style.css`:

```css
:root {
    --bg: #00050b;
    --text: #f5faff;
    --accent: #7fd8ff;
    /* etc... */
}
```

## Converting Video to Frame Sequence

This project requires a sequence of individual image frames extracted from video. Here are two methods to convert your video files:

### Method 1: Using ExGif (Web-Based)

**ExGif** is an online tool for converting video to image sequences with a simple GUI.

**Steps:**

1. Visit [ExGif.com](https://exgif.com/) or similar video-to-frames converter
2. Upload your video file (MP4, MOV, WebM, etc.)
3. Configure extraction settings:
   - **Frame Rate**: Set to your target FPS (e.g., 60fps for smooth animation)
   - **Output Format**: Select JPG for smaller file size
   - **Quality**: Set to 80-90% for balance between quality and size
4. Click "Convert" and wait for processing
5. Download the ZIP file containing all extracted frames
6. Extract frames and rename them in the pattern: `frame-0001.jpg`, `frame-0002.jpg`, etc.
7. Place frames in the `Frames/` directory

**Pros:**
- No software installation required
- Simple point-and-click interface
- Quick for small-to-medium videos

**Cons:**
- File size limits on most free services
- Less control over output parameters
- Slower for large videos

### Method 2: Using FFmpeg (Command Line)

**FFmpeg** is a powerful, free, open-source multimedia framework for frame extraction with full control.

**Installation:**

- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html) or use `choco install ffmpeg`
- **macOS**: `brew install ffmpeg`
- **Linux**: `apt-get install ffmpeg` (Debian/Ubuntu)

**Basic Command:**

Extract all frames from a video at 60fps:

```bash
ffmpeg -i input_video.mp4 -vf "fps=60" Frames/frame-%04d.jpg
```

**Command Breakdown:**
- `-i input_video.mp4` — Input video file
- `-vf "fps=60"` — Extract at 60 frames per second
- `Frames/frame-%04d.jpg` — Output pattern (%04d = zero-padded 4-digit number)

**Advanced Examples:**

Extract frames with custom quality (1-31, lower = better):

```bash
ffmpeg -i input_video.mp4 -vf "fps=60" -q:v 2 Frames/frame-%04d.jpg
```

Extract frames at specific resolution (scale to 1920x1080):

```bash
ffmpeg -i input_video.mp4 -vf "fps=60,scale=1920:1080" Frames/frame-%04d.jpg
```

Extract specific time range (first 30 seconds):

```bash
ffmpeg -i input_video.mp4 -t 30 -vf "fps=60" Frames/frame-%04d.jpg
```

Extract frames with aspect ratio preservation:

```bash
ffmpeg -i input_video.mp4 -vf "fps=60,scale=1920:-1" Frames/frame-%04d.jpg
```

**Batch Process Multiple Videos:**

```bash
for video in *.mp4; do
  mkdir -p "Frames_${video%.*}"
  ffmpeg -i "$video" -vf "fps=60" "Frames_${video%.*}/frame-%04d.jpg"
done
```

**Pros:**
- Free and open-source
- Full control over parameters
- Fast processing on local machine
- Handles large files efficiently
- Batch processing capabilities

**Cons:**
- Requires command-line knowledge
- Installation needed
- Steeper learning curve

**Recommended FFmpeg Settings for This Project:**

```bash
ffmpeg -i video.mp4 -vf "fps=60" -q:v 3 Frames/frame-%04d.jpg
```

This extracts frames at 60fps with good quality balance. Adjust `-q:v` (2-5) based on file size constraints.

**Verify Frame Count:**

After extraction, count frames to ensure all were extracted:

```bash
# Windows (PowerShell)
(Get-ChildItem -Path Frames -Filter "*.jpg" | Measure-Object).Count

# Linux/macOS
ls -1 Frames | wc -l
```

Then update `CONFIG.frameCount` in `script.js` with the actual frame count.

## Browser Developer Tools

Open DevTools to monitor:
- **Console**: Frame loading progress and any errors
- **Performance**: FPS and frame timing in the Animation panel
- **Network**: Frame loading status (should cache after preload)

## License

Built with passion for immersive web experiences. Feel free to adapt and learn from this implementation.

## Support

For questions about the frame animation system, scroll performance, or customization, refer to the inline comments in `script.js` for detailed explanations of each system component.

---

**Created by Alex Carter** | Bringing motion, performance, and story to the web.
