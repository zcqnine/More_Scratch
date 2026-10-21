<div align="center">

# 🧩 ScratchMore Extension for TurboWarp

**Pushing the limits of block-based programming.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TurboWarp](https://img.shields.io/badge/Platform-TurboWarp-blueviolet.svg)](https://turbowarp.org/)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

*ScratchMore is a hardcore, 1000-line pure JavaScript extension that brings advanced game-engine features directly into TurboWarp.*

*ScratchMore 是一个纯手工打造的 TurboWarp 底层扩展。涵盖物理机制、音视频处理、高级事件与超强运算，为你带来最丝滑的创作体验。*

</div>

---

## 📖 Table of Contents / 目录

- [✨ Monster Features / 核心功能](#-monster-features--核心功能)
  - [1. Movement & Physics](#1-movement--physics--移动与物理)
  - [2. Image Processing](#2-image-processing--图像处理)
  - [3. Audio Studio](#3-audio-studio--音频工作室)
  - [4. Advanced Events](#4-advanced-events--高级事件)
  - [5. Control & Sensing](#5-control--sensing--控制与侦测)
  - [6. Super Math & Text](#6-super-math--text--运算与文本)
- [🚀 Installation & Usage / 安装与使用](#-installation--usage--安装与使用)
- [⚠️ Sandbox Mode Warning / 沙盒模式警告](#-sandbox-mode-warning--沙盒模式警告)
- [🛠️ Under the Hood / 底层技术揭秘](#️-under-the-hood--底层技术揭秘)
- [❓ FAQ / 常见问题](#-faq--常见问题)
- [🤝 Credits & License / 致谢与开源协议](#-credits--license--致谢与开源协议)

---

## ✨ Monster Features / 核心功能

ScratchMore provides a complete suite of advanced blocks divided into 6 main categories.
*(ScratchMore 提供了分为 6 大模块的完整高级积木套件。)*

### 1. Movement & Physics / 移动与物理

Upgrade your character's movement from basic "Move 10 steps" to true mathematical interpolation.
*(将角色的移动从基础的“移动10步”升级为真正的数学插值。)*

- **Glide Along Path / 沿路径点滑行**: 
  Input X and Y arrays to make the sprite glide smoothly through multiple waypoints. Supports linear interpolation.
- **Non-linear Chasing / 非线性平滑追逐**: 
  Implement `SmoothDamp` logic. The sprite chases a target with easing (fast when far, slow when close) and respects a `maxSpeed` limit. Perfect for enemy AI or pet following.
- **Absolute Direction Move / 绝对方向移动**: 
  Moves the sprite in a specific direction without changing its visual rotation. Ideal for bullet-hell or independent physics.
- **Pixel-level Bounce / 像素级颜色反弹**: 
  Uses WebGL to detect if the sprite touches a specific RGB color and bounces back. 
- **Move Speed Multiplier / 移动倍率修改**: 
  Intercepts the underlying engine to multiply the effect of the original `move () steps` block.

### 2. Image Processing / 图像处理

Forget manual image editing. Process images directly in the engine.
*(告别手动修图，直接在引擎内处理图像。)*

- **Replace Color / 像素级颜色替换**: 
  Reads the costume's Canvas, iterates through all pixels, replaces Color A with Color B, and generates a brand new WebGL Skin dynamically. 
  *Note: Includes a 15-tolerance anti-aliasing buffer.*
- **Clear Effects / 清除特效**: 
  Restores the original costume and discards all dynamically generated skins.

### 3. Audio Studio / 音频工作室

Deep dive into `Web Audio API` and raw `PCM` data.
*(深入 Web Audio API 和原始 PCM 数据。)*

- **Reverse Audio / 音频倒放**: 
  Extracts the raw audio buffer, reverses the waveform array, and plays it back. True reverse audio without pre-processing. Includes a fallback for parsing legacy WAV formats.
- **Microphone Recording / 麦克风录音**: 
  Captures real-time audio from the user's microphone. Features a **custom UI with a blinking red dot and countdown timer**, turning green when finished.
- **Play Recording / 播放录音**: 
  Plays the recorded audio stored in memory, blocking the thread until finished (similar to "Play sound until done").

### 4. Advanced Events / 高级事件

Go beyond the standard "When Green Flag Clicked".
*(超越标准的“当绿旗被点击”。)*

- **When List Changes / 当列表发生变化**: 
  Uses thread-level caching (`thread.getId()`) to detect additions, deletions, or modifications in a list and triggers instantly.
- **While Key Held / 当按键持续按住时**: 
  Triggers continuously every frame while a key is pressed, unlike the original single-trigger block.
- **When Stage Resized / 当舞台尺寸改变时**: 
  Utilizes `ResizeObserver` on the stage Canvas to detect when the player resizes the window or changes the aspect ratio.

### 5. Control & Sensing / 控制与侦测

- **Combo Key Detection / 组合键按下检测**: 
  Detects if two keys (e.g., `Ctrl + Z` or `Shift + A`) are pressed simultaneously using `util.ioQuery`.
- **Stage Contains Color / 舞台背景颜色检测**: 
  Reads the Stage's Canvas pixels to detect if a specific color exists. Uses caching to ensure 0-delay performance in loops.

### 6. Super Math & Text / 运算与文本

- **Power / 任意次方**: Calculates `A` to the power of `B`. Includes `NaN` protection.
- **Root / 任意开方**: Calculates the `B`-th root of `A`. Prevents crashes on negative numbers or division by zero.
- **Replace Text / 文本全局替换**: Replaces all occurrences of substring A with substring B using `split().join()` (safer than Regex).
- **List Deduplicate / 列表极速去重**: Instantly removes all duplicates from a list using JS `Set` and forces the UI monitor to refresh.

---

## 🚀 Installation & Usage / 安装与使用

1. Download the latest `smore_scratch.js` file from this repository or the Releases page.
2. Open **TurboWarp Desktop** or **TurboWarp Web**.
3. Click on **"Add Extension"** -> **"Load Custom Extension"** (or drag and drop the `.js` file).
4. Select the downloaded file.
5. **Enjoy!**

---

## ⚠️ Sandbox Mode Warning / 沙盒模式警告

> **🚨 CRITICAL / 极其重要**

This extension uses TurboWarp-exclusive APIs, including **Web Audio**, **Canvas Pixel Manipulation**, and **Dynamic HAT blocks**. 

**YOU MUST TURN OFF SANDBOX MODE.**

- **How to disable**: Go to `File` -> `Settings` -> Uncheck `Sandbox Mode`.
- **Why**: If Sandbox Mode is ON, the extension will not be able to access the renderer, play audio, or intercept keyboard events. Most advanced blocks will fail silently.

---

## 🛠️ Under the Hood / 底层技术揭秘

Why is this extension so smooth? It's not just basic Scratch blocks.

- **WebGL Skin Generation**: For `Replace Color`, we don't modify the original asset. We create a hidden `<canvas>`, paint pixels, and use `renderer.createBitmapSkin()` to hot-swap the skin at runtime.
- **Web Audio API**: For `Reverse Audio`, we fetch the `.mp3` file as an `ArrayBuffer`, decode it to a `AudioBuffer`, reverse the float arrays, and play it using `AudioBufferSourceNode`. If the browser fails to decode native WAV formats, we manually parse the binary chunks.
- **Thread-level Caching**: For `When List Changes`, we use `util.thread.getId()` to ensure each script has its own memory, preventing cross-interference between clones.
- **ResizeObserver**: For `When Stage Resized`, standard `window.resize` is not enough. We observe the specific canvas element to detect TurboWarp UI changes.

---

## ❓ FAQ / 常见问题

**Q: Why does the Reverse Audio block fail on some native Scratch sounds?**
A: Scratch's native sounds (like "Baa") are often stored in highly compressed or legacy WAV formats that the modern browser `decodeAudioData` API cannot parse. Please use a standard MP3 or record your own sound. Alternatively, use the "Reverse" button in Scratch's sound editor.

**Q: Why does Microphone Recording fail?**
A: Ensure you have granted microphone permissions in TurboWarp Desktop settings or your browser. If using a browser, make sure the URL is `https://` (not `http://`).

**Q: The list deduplication block works in code, but the list on stage doesn't change?**
A: We fixed this by manually calling `util.runtime.requestUpdateMonitor`. Make sure you are using the latest version.

---

## 🤝 Credits & License / 致谢与开源协议

This project is licensed under the **MIT License**.

Special thanks to:
- **[@LilyMakesThings](https://scratch.mit.edu/users/LilyMakesThings/)** and **GarboMuffin** for their incredible open-source HAT block implementations and inspiration.
- The TurboWarp community for pushing the boundaries of Scratch.

---

## 👨‍💻 Author / 作者

**九九 (nine)**
- 📺 Bilibili: [Watch Tutorials & Get Extraction Codes](https://space.bilibili.com/3546910872832474)
- 🌐 Official Website: [ScratchMore Homepage](https://zcqnine.github.io/More_Scratch/)

<div align="center">

**If you find this extension helpful, please give this repo a ⭐ and follow me on Bilibili!**
*(如果这个扩展帮到了你，请给仓库点个 Star，并去 B 站给我一个三连吧！)*

</div>
