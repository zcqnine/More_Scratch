//by:Nine
//Modification time:2026/10/18
//v1.0.0
(function(Scratch) {
    "use strict";

    class ScratchMore {
        constructor() {
            this.moveSpeedMultiplier = 1;
            this.hasAcknowledged = false; 
            this.recordings = {};
            this._recUITimer = null;
            this.listThreadValues = {};
            this.bgColorCache = {};

            if (Scratch.vm && Scratch.vm.runtime) {
                Scratch.vm.runtime.on('BEFORE_EXECUTE', () => {
                    Scratch.vm.runtime.startHats('ScrMoBlock_ifLitCgHAT');
                    Scratch.vm.runtime.startHats('ScrMoBlock_keyWhiHAT');
                });
                Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => {
                    this.listThreadValues = {};
                });
            }

            if (typeof ResizeObserver !== 'undefined' && Scratch.vm.runtime.renderer) {
                this.stageResizeTimer = null;
                const canvas = Scratch.vm.runtime.renderer.canvas;
                
                const observer = new ResizeObserver(() => {
                    if (this.stageResizeTimer) clearTimeout(this.stageResizeTimer);
                    this.stageResizeTimer = setTimeout(() => {
                        Scratch.vm.runtime.startHats('ScrMoBlock_whenStageResized');
                    }, 100);
                });
                observer.observe(canvas);
            }
        }

        getInfo() {
            return {
                id: "ScrMoBlock",
                name: "Scratch积木扩展",
                color1: "#ffc642",
                color2: "#ffe866",
                color3: "#efeba1",
                menus: {
                    sprites: {
                        acceptReporters: false,
                        items: "getSpriteList"
                    },
                    animType: {
                        acceptReporters: false,
                        items: [
                            { text: "非线", value: "nonlinear" },
                            { text: "线", value: "linear" }
                        ]
                    },
                    sounds: {
                        acceptReporters: false,
                        items: "getSoundList"
                    },
                    lists: {
                        acceptReporters: false,
                        items: "getListLists"
                    },
                    keys: {
                        acceptReporters: true, 
                        items: [
                            { text: "空格", value: "space" },
                            { text: "↑", value: "up arrow" },
                            { text: "↓", value: "down arrow" },
                            { text: "→", value: "right arrow" },
                            { text: "←", value: "left arrow" },
                            { text: "任何", value: "any" },
                            { text: "a", value: "a" }, { text: "b", value: "b" }, { text: "c", value: "c" },
                            { text: "d", value: "d" }, { text: "e", value: "e" }, { text: "f", value: "f" },
                            { text: "g", value: "g" }, { text: "h", value: "h" }, { text: "i", value: "i" },
                            { text: "j", value: "j" }, { text: "k", value: "k" }, { text: "l", value: "l" },
                            { text: "m", value: "m" }, { text: "n", value: "n" }, { text: "o", value: "o" },
                            { text: "p", value: "p" }, { text: "q", value: "q" }, { text: "r", value: "r" },
                            { text: "s", value: "s" }, { text: "t", value: "t" }, { text: "u", value: "u" },
                            { text: "v", value: "v" }, { text: "w", value: "w" }, { text: "x", value: "x" },
                            { text: "y", value: "y" }, { text: "z", value: "z" },
                            { text: "0", value: "0" }, { text: "1", value: "1" }, { text: "2", value: "2" },
                            { text: "3", value: "3" }, { text: "4", value: "4" }, { text: "5", value: "5" },
                            { text: "6", value: "6" }, { text: "7", value: "7" }, { text: "8", value: "8" },
                            { text: "9", value: "9" },
                            { text: "Shift", value: "shift" }, { text: "Ctrl", value: "control" }, { text: "Alt", value: "alt" },
                        ]
                    }
                },
                blocks: [
                    "---",
                    { blockType: Scratch.BlockType.LABEL, text: "移动类" },
                    {
                        opcode: "xymoremoveCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "沿路径点x[xp] y[yp] 滑行[s]秒",
                        arguments: {
                            xp: { type: Scratch.ArgumentType.STRING, defaultValue: "[50,0,150]" },
                            yp: { type: Scratch.ArgumentType.STRING, defaultValue: "[50,0,125]" },
                            s: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3.5 }
                        }
                    },
                    {
                        opcode: "stepSpeedCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "设置移动基础速度为[sped]倍",
                        arguments: {
                            sped: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
                        }
                    },
                    {
                        opcode: "dirMoSetCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "向[dir]方向移动[step]步",
                        arguments: {
                            dir: { type: Scratch.ArgumentType.ANGLE, defaultValue: 45 },
                            step: { type: Scratch.ArgumentType.NUMBER, defaultValue: 25 }
                        }
                    },
                    {
                        opcode: "goStepCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "移动[step]步",
                        arguments: {
                            step: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
                        }
                    },
                    {
                        opcode: "tchColrDumCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "碰到[color]时反弹",
                        arguments: {
                            color: { type: Scratch.ArgumentType.COLOR, defaultValue: "#fff87b" }
                        }
                    },
                    {
                        opcode: "chaSPrSpeedCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "使用[xian]性动画，以[step]步的速度追逐[cha]直到距离[px]像素",
                        arguments: {
                            xian: { type: Scratch.ArgumentType.STRING, menu: "animType", defaultValue: "nonlinear" },
                            step: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
                            cha: { type: Scratch.ArgumentType.STRING, menu: "sprites", defaultValue: "角色1" },
                            px: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "造型类" },
                    {
                        opcode: "repColorCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "将角色中[anu]的所有[coulor1]替换为[coulor2]",
                        arguments: {
                            anu: { type: Scratch.ArgumentType.STRING, defaultValue: "造型1" },
                            coulor1: { type: Scratch.ArgumentType.COLOR, defaultValue: "#ffc642" },
                            coulor2: { type: Scratch.ArgumentType.COLOR, defaultValue: "#45f642" }
                        }
                    },
                    {
                        opcode: "clearColCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "清除已有的特效"
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "声音类" },
                    {
                        opcode: "filpSodCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "播放声音[sound]并倒放",
                        arguments: {
                            sound: { type: Scratch.ArgumentType.STRING, defaultValue: "无声音", menu: "sounds" }
                        }
                    },
                    {
                        opcode: "recordCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "录制声音[secs]秒并存储在[rename]里",
                        arguments: {
                            secs: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
                            rename: { type: Scratch.ArgumentType.STRING, defaultValue: "recording1" }
                        }
                    },
                    {
                        opcode: "playRecCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "播放录制的声音[prename]",
                        arguments: {
                            prename: { type: Scratch.ArgumentType.STRING, defaultValue: "recording1" }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "事件类" },
                    {
                        opcode: "ifLitCgHAT",
                        blockType: Scratch.BlockType.HAT,
                        text: "当列表[list]发生变化",
                        isEdgeActivated: false,
                        arguments: {
                            list: { type: Scratch.ArgumentType.STRING, defaultValue: "无列表", menu: "lists" }
                        }
                    },
                    {
                        opcode: "keyWhiHAT",
                        blockType: Scratch.BlockType.HAT,
                        text: "当键盘[KEY_OPTION]键持续按住时",
                        isEdgeActivated: false, 
                        arguments: {
                            KEY_OPTION: { type: Scratch.ArgumentType.STRING, defaultValue: "space", menu: "keys" }
                        }
                    },
                    {
                        opcode: "whnStResHAT",
                        blockType: Scratch.BlockType.HAT,
                        text: "当舞台显示尺寸改变时",
                        isEdgeActivated: false 
                    },
                    {
                        opcode: "getStLoWREP",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "舞台逻辑宽度"
                    },
                    {
                        opcode: "getStDpWREP",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "舞台实际显示宽度"
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "控制类" },
                    {
                        opcode: "waitTTiCOM",
                        blockType: Scratch.BlockType.COMMAND, 
                        text: "等待 [event] 成立，接着再等待 [s] 秒",
                        arguments: {
                            event: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: false },
                            s: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1.5 }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "侦测类" },
                    {
                        opcode: "cBKeyBOOL",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "组合键 [KEY1] + [KEY2] 被按下?",
                        arguments: {
                            KEY1: { type: Scratch.ArgumentType.STRING, defaultValue: "control", menu: "keys" },
                            KEY2: { type: Scratch.ArgumentType.STRING, defaultValue: "o", menu: "keys" }
                        }
                    },
                    {
                        opcode: "bgHaColBOOL",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "舞台上包含颜色[color]?",
                        arguments: {
                            color: { type: Scratch.ArgumentType.COLOR, defaultValue: "#ffffff" }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "运算类" },
                    {
                        opcode: "powREP",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[a]的[b]次方",
                        arguments: {
                            a: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
                            b: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
                        }
                    },
                    {
                        opcode: "rootREP",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[a]开[b]次方",
                        arguments: {
                            a: { type: Scratch.ArgumentType.NUMBER, defaultValue: 8 },
                            b: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
                        }
                    },
                    {
                        opcode: "tereREP",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "将文本[text]中的[a]全部替换为[b]",
                        arguments: {
                            text: { type: Scratch.ArgumentType.STRING, defaultValue: "你好！世界！" },
                            a: { type: Scratch.ArgumentType.STRING, defaultValue: "世界" },
                            b: { type: Scratch.ArgumentType.STRING, defaultValue: "Scratch" }
                        }
                    },
                    {
                        opcode: "deRepListCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "对列表[list]进行去重",
                        arguments: {
                            list: { type: Scratch.ArgumentType.STRING, menu: "lists", defaultValue: "无列表" }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "语音类" },
                    {
                        opcode: "speakTextCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "朗读文本 [text] 语速 [rate]",
                        arguments: {
                            text: { type: Scratch.ArgumentType.STRING, defaultValue: "你好，我是九九！" },
                            rate: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
                        }
                    },
                    {
                        opcode: "stopSpeakCOM",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "停止朗读"
                    }
                ]
            };
        }   

        getSoundList() {
            if (!Scratch.vm || !Scratch.vm.editingTarget || !Scratch.vm.editingTarget.sprite) return ["无声音"];
            const sounds = Scratch.vm.editingTarget.sprite.sounds.map(s => s.name);
            return sounds.length > 0 ? sounds : ["无声音"];
        }

        getSpriteList() {
            if (!Scratch.vm || !Scratch.vm.runtime) return ["无角色"];
            const targets = Scratch.vm.runtime.targets;
            const names = targets.filter(t => t.isOriginal && !t.isStage).map(t => t.getName());
            return names.length > 0 ? names : ["无角色"];
        }

        getListLists() {
            if (!Scratch.vm || !Scratch.vm.runtime) return ["无列表"];
            const lists = new Set();
            const targets = Scratch.vm.runtime.targets;
            
            for (const target of targets) {
                for (const varId in target.variables) {
                    const variable = target.variables[varId];
                    if (variable.type === 'list') {
                        lists.add(variable.name);
                    }
                }
            }
            return lists.size > 0 ? Array.from(lists) : ["无列表"];
        }

        showConfirmModal(message) {
            if (typeof document === 'undefined') return;
            const existing = document.getElementById('scratch-ext-modal');
            if (existing) existing.remove();
            const overlay = document.createElement('div');
            overlay.id = 'scratch-ext-modal';
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.5); z-index: 99999;
                display: flex; justify-content: center; align-items: center;
                backdrop-filter: blur(3px);
            `;
            const box = document.createElement('div');
            box.style.cssText = `
                background: #fff; padding: 25px 35px; border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3); text-align: center;
                font-family: sans-serif; max-width: 400px; animation: popIn 0.2s ease-out;
            `;
            const text = document.createElement('p');
            text.innerText = message;
            text.style.cssText = `margin: 0 0 20px 0; font-size: 16px; color: #333; line-height: 1.5; font-weight: bold;`;
            const btn = document.createElement('button');
            btn.innerText = "我知道了";
            btn.style.cssText = `
                background: #ffc642; color: #333; border: none; padding: 10px 25px;
                border-radius: 20px; font-size: 15px; font-weight: bold; cursor: pointer;
                transition: transform 0.1s;
            `;
            btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseout = () => btn.style.transform = 'scale(1)';
            btn.onclick = () => {
                overlay.remove(); 
                this.hasAcknowledged = true; 
            };
            box.appendChild(text);
            box.appendChild(btn);
            overlay.appendChild(box);
            document.body.appendChild(overlay);
        }

        showRecordingUI(secs) {
            if (typeof document === 'undefined') return;
            const existing = document.getElementById('scratch-ext-rec-ui');
            if (existing) existing.remove();
            if (this._recUITimer) {
                clearInterval(this._recUITimer);
                this._recUITimer = null;
            }

            const recUI = document.createElement('div');
            recUI.id = 'scratch-ext-rec-ui';
            recUI.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background: rgba(255, 59, 48, 0.95); color: white; padding: 12px 24px;
                border-radius: 30px; font-size: 16px; font-weight: bold;
                font-family: sans-serif; z-index: 99999; display: flex; align-items: center;
                gap: 10px; box-shadow: 0 4px 15px rgba(255, 59, 48, 0.4);
                transition: background 0.3s, box-shadow 0.3s;
            `;
            
            const dot = document.createElement('div');
            dot.style.cssText = `width: 12px; height: 12px; background: white; border-radius: 50%; animation: recBlink 1s infinite;`;
            
            if (!document.getElementById('rec-anim-style')) {
                const style = document.createElement('style');
                style.id = 'rec-anim-style';
                style.innerHTML = `@keyframes recBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`;
                document.head.appendChild(style);
            }

            const textNode = document.createElement('span');
            let remaining = Math.ceil(secs); 
            textNode.innerText = `正在录音... ${remaining} 秒`;

            recUI.appendChild(dot);
            recUI.appendChild(textNode);
            document.body.appendChild(recUI);

            this._recUITimer = setInterval(() => {
                remaining--;
                if (remaining > 0) {
                    textNode.innerText = `正在录音... ${remaining} 秒`;
                } else {
                    clearInterval(this._recUITimer);
                    this._recUITimer = null;
                    recUI.style.background = 'rgba(52, 199, 89, 0.95)'; 
                    recUI.style.boxShadow = '0 4px 15px rgba(52, 199, 89, 0.4)';
                    dot.style.animation = 'none'; 
                    dot.style.opacity = '1';
                    textNode.innerText = `✅ 录音完成！`;
                    
                    setTimeout(() => {
                        if (recUI.parentNode) recUI.remove();
                    }, 1000);
                }
            }, 1000);
        }

        xymoremoveCOM(args, util) {
            if (typeof util.stackFrame.startTime === 'undefined') {
                const parseArray = (str) => {
                    try { return JSON.parse(str); } catch (e) { return str.replace(/[\[\]]/g, '').split(/[\s,]+/).map(Number); }
                };
                const xArr = parseArray(args.xp);
                const yArr = parseArray(args.yp);
                if (!Array.isArray(xArr) || !Array.isArray(yArr) || xArr.length !== yArr.length || xArr.length < 2) {
                    console.error("滑行积木：x和y数组长度不一致，或点数少于2个！");
                    return; 
                }
                util.stackFrame.xArr = xArr;
                util.stackFrame.yArr = yArr;
                util.stackFrame.totalTime = Number(args.s) * 1000; 
                util.stackFrame.startTime = Date.now();
                util.stackFrame.currentSegment = 0; 
            }
            const now = Date.now();
            const elapsed = now - util.stackFrame.startTime;
            const totalTime = util.stackFrame.totalTime;
            const xArr = util.stackFrame.xArr;
            const yArr = util.stackFrame.yArr;
            const pointsCount = xArr.length;
            const segmentDuration = totalTime / (pointsCount - 1);
            const segmentIndex = Math.floor(elapsed / segmentDuration);
            if (segmentIndex >= pointsCount - 1) {
                util.target.setXY(xArr[pointsCount - 1], yArr[pointsCount - 1]);
                delete util.stackFrame.startTime;
                return;
            }
            const timeInSegment = elapsed % segmentDuration;
            const progress = timeInSegment / segmentDuration; 
            const startX = xArr[segmentIndex];
            const startY = yArr[segmentIndex];
            const endX = xArr[segmentIndex + 1];
            const endY = yArr[segmentIndex + 1];
            const currentX = startX + (endX - startX) * progress;
            const currentY = startY + (endY - startY) * progress;
            util.target.setXY(currentX, currentY);
            util.yield();
        }

        stepSpeedCOM(args) {
            const speed = Number(args.sped);
            this.moveSpeedMultiplier = speed > 0 ? speed : 1;
            if (!this.hasAcknowledged) {
                this.showConfirmModal("⚠️ 设置成功！\n请使用本扩展中的『移动』积木才受倍率影响！");
            }
        }

        dirMoSetCOM(args, util) {
            const currentX = util.target.x;
            const currentY = util.target.y;
            const direction = Number(args.dir); 
            const step = Number(args.step);     
            const radians = (90 - direction) * (Math.PI / 180);
            const dx = step * Math.cos(radians);
            const dy = step * Math.sin(radians);
            util.target.setXY(currentX + dx, currentY + dy);
        }

        goStepCOM(args, util) {
            const baseStep = Number(args.step);
            const actualStep = baseStep * this.moveSpeedMultiplier;
            const direction = util.target.direction;
            const radians = (90 - direction) * (Math.PI / 180);
            const dx = actualStep * Math.cos(radians);
            const dy = actualStep * Math.sin(radians);
            util.target.setXY(util.target.x + dx, util.target.y + dy);
            if (this.moveSpeedMultiplier !== 1) {
                console.log(`✨ 自定义移动生效！原步数 ${baseStep}, 实际移动 ${actualStep} 步`);
            }
        }

        tchColrDumCOM(args, util) {
            const renderer = Scratch.vm.runtime.renderer;
            if (!renderer) return; 
            const drawableID = util.target.drawableID;
            const hex = args.color.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            const rgb = [r, g, b];
            if (renderer.isTouchingColor(drawableID, rgb)) {
                util.target.setDirection(util.target.direction + 180);
            }
        }

        chaSPrSpeedCOM(args, util) {
            const targetName = String(args.cha).trim();
            if (!targetName || targetName === "无角色") return;
            const target = Scratch.vm.runtime.getSpriteTargetByName(targetName);
            if (!target || target === util.target) return; 
            const dx = target.x - util.target.x;
            const dy = target.y - util.target.y;
            const distance = Math.sqrt(dx * dx + dy * dy); 
            const targetDist = Number(args.px);
            if (distance === 0) return; 
            const maxSpeed = Number(args.step) || 10; 
            const diff = distance - targetDist; 
            if (Math.abs(diff) < 0.5) return;
            let moveAmount = 0;
            if (args.xian === "linear") {
                moveAmount = Math.sign(diff) * Math.min(Math.abs(diff), maxSpeed);
            } else {
                moveAmount = diff * 0.15;
                if (Math.abs(moveAmount) > maxSpeed) {
                    moveAmount = Math.sign(moveAmount) * maxSpeed;
                }
            }
            let angleRad = Math.atan2(dy, dx);
            let scratchDir = 90 - (angleRad * 180 / Math.PI);
            util.target.setDirection(scratchDir);
            const ux = dx / distance; 
            const uy = dy / distance; 
            util.target.setXY(util.target.x + ux * moveAmount, util.target.y + uy * moveAmount);
        }

        repColorCOM(args, util) {
            const costume = util.target.sprite.costumes.find(c => c.name === args.anu);
            if (!costume) {
                console.warn("未找到指定造型:", args.anu);
                return;
            }
            const hexToRgb = (hex) => {
                const h = hex.replace('#', '');
                return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
            };
            const oldRgb = hexToRgb(args.coulor1);
            const newRgb = hexToRgb(args.coulor2);
            const img = new Image();
            img.src = costume.asset.encodeDataURI();
            
            img.onload = () => {
                if (img.width === 0 || img.height === 0) return;
                const renderer = Scratch.vm.runtime.renderer;
                const drawable = renderer._allDrawables[util.target.drawableID];
                const oldSkin = drawable.skin;
                const targetWidth = oldSkin.size[0];
                const targetHeight = oldSkin.size[1];
                const canvas = document.createElement('canvas');
                const SCALE = 2; 
                canvas.width = targetWidth * SCALE;
                canvas.height = targetHeight * SCALE;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                let replacedCount = 0;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const tolerance = 15; 
                    if (Math.abs(r - oldRgb[0]) <= tolerance && Math.abs(g - oldRgb[1]) <= tolerance && Math.abs(b - oldRgb[2]) <= tolerance && data[i + 3] > 0) { 
                        data[i] = newRgb[0];
                        data[i + 1] = newRgb[1];
                        data[i + 2] = newRgb[2];
                        replacedCount++;
                    }
                }
                ctx.putImageData(imgData, 0, 0);
                const skinId = renderer.createBitmapSkin(canvas); 
                const newSkin = renderer._allSkins[skinId];
                if (newSkin && oldSkin) {
                    newSkin._size = oldSkin._size; 
                    newSkin._rotationCenter = oldSkin._rotationCenter;
                }
                renderer.updateDrawableSkinId(util.target.drawableID, skinId);
                console.log(`✨ 替换完毕！共修改了 ${replacedCount} 个像素。`);
            };
        }

        clearColCOM(args, util) {
            util.target.clearEffects();
            util.target.setCostume(util.target.currentCostume);
            Scratch.vm.runtime.requestRedraw();
        }

        async filpSodCOM(args, util) {
            const sound = util.target.sprite.sounds.find(s => s.name === args.sound);
            if (!sound || !sound.asset) {
                console.warn("❌ 没找到声音或声音资产尚未加载！");
                return;
            }
            try {
                const audioEngine = Scratch.vm.runtime.audioEngine;
                const audioContext = audioEngine.audioContext;
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }
                const dataURI = sound.asset.encodeDataURI();
                const response = await fetch(dataURI);
                const arrayBuffer = await response.arrayBuffer();
                const originalBuffer = await audioContext.decodeAudioData(arrayBuffer);
                const reversedBuffer = audioContext.createBuffer(
                    originalBuffer.numberOfChannels,
                    originalBuffer.length,
                    originalBuffer.sampleRate
                );
                for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
                    const originalData = originalBuffer.getChannelData(channel);
                    const reversedData = reversedBuffer.getChannelData(channel);
                    for (let i = 0; i < originalData.length; i++) {
                        reversedData[i] = originalData[originalData.length - 1 - i];
                    }
                }
                const source = audioContext.createBufferSource();
                source.buffer = reversedBuffer;
                const inputNode = audioEngine.inputNode || audioContext.destination;
                source.connect(inputNode);
                source.start(0);
                await new Promise((resolve) => {
                    source.onended = resolve;
                });
            } catch (e) {
                console.error("💥 倒放发生错误:", e);
            }
        }

        async recordCOM(args, util) {
            const secs = Number(args.secs);
            const rename = String(args.rename).trim();
            if (secs <= 0 || !rename) return;
            const audioEngine = Scratch.vm.runtime.audioEngine;
            const audioContext = audioEngine.audioContext;
            if (audioContext && audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                const chunks = [];
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) chunks.push(e.data);
                };
                const recordingPromise = new Promise((resolve, reject) => {
                    mediaRecorder.onstop = async () => {
                        stream.getTracks().forEach(track => track.stop());
                        try {
                            const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
                            const arrayBuffer = await blob.arrayBuffer();
                            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                            this.recordings[rename] = audioBuffer;
                            resolve(); 
                        } catch (err) {
                            reject(err);
                        }
                    };
                    mediaRecorder.onerror = (err) => reject(err);
                    mediaRecorder.start();
                    this.showRecordingUI(secs);
                    setTimeout(() => {
                        if (mediaRecorder.state !== 'inactive') {
                            mediaRecorder.stop();
                        }
                    }, secs * 1000);
                });
                await recordingPromise;
            } catch (e) {
                console.error("❌ 录音失败:", e);
                alert(`录音失败: ${e.name}\n原因: ${e.message}\n请检查系统或软件麦克风权限！`);
            }
        }

        async playRecCOM(args, util) {
            const rename = String(args.prename).trim();
            const audioBuffer = this.recordings[rename];
            if (!audioBuffer) {
                console.warn(`❌ 找不到名为 [${rename}] 的录音，请先录制！`);
                return;
            }
            try {
                const audioEngine = Scratch.vm.runtime.audioEngine;
                const audioContext = audioEngine.audioContext;
                if (audioContext.state === 'suspended') {
                    await audioContext.resume();
                }
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                const inputNode = audioEngine.inputNode || audioContext.destination;
                source.connect(inputNode);
                source.start(0);
                await new Promise((resolve) => {
                    source.onended = resolve;
                });
            } catch (e) {
                console.error("💥 播放录音失败:", e);
            }
        }

        ifLitCgHAT(args, util) {
            const threadId = util.thread.getId(); 
            const listName = args.list; 
            const target = util.target; 
            if (!listName || listName === "无列表") return false;
            const variable = target.lookupOrCreateList(listName, listName);
            if (!variable) return false;
            const currentValue = JSON.stringify(variable.value);
            if (this.listThreadValues[threadId] === undefined) {
                this.listThreadValues[threadId] = currentValue;
                return false; 
            }
            if (this.listThreadValues[threadId] !== currentValue) {
                this.listThreadValues[threadId] = currentValue; 
                return true; 
            }
            return false; 
        }

        keyWhiHAT(args, util) {
            const key = Scratch.Cast.toString(args.KEY_OPTION).toLowerCase();
            return util.ioQuery("keyboard", "getKeyIsDown", [key]);
        }

        whnStResHAT(args, util) {
            return true;
        }

        getStLoWREP() {
            return Scratch.vm.runtime.stageWidth;
        }

        getStDpWREP() {
            const canvas = Scratch.vm.runtime.renderer.canvas;
            return canvas ? canvas.clientWidth : 480;
        }

        waitTTiCOM(args, util) {
            if (util.stackFrame.phase === undefined) {
                util.stackFrame.phase = 1;
            }
            if (util.stackFrame.phase === 1) {
                if (!Boolean(args.event)) {
                    util.yield(); 
                    return;
                }
                util.stackFrame.phase = 2;
                util.stackFrame.startDelayTime = Date.now();
            }
            if (util.stackFrame.phase === 2) {
                const waitMs = Number(args.s) * 1000;
                const elapsed = Date.now() - util.stackFrame.startDelayTime;
                if (elapsed < waitMs) {
                    util.yield(); 
                    return;
                }
                delete util.stackFrame.phase;
                delete util.stackFrame.startDelayTime;
            }
        }

        cBKeyBOOL(args, util) {
            const key1 = Scratch.Cast.toString(args.KEY1).toLowerCase();
            const key2 = Scratch.Cast.toString(args.KEY2).toLowerCase();
            if (key1 === key2) {
                return util.ioQuery("keyboard", "getKeyIsDown", [key1]);
            }
            const isKey1Down = util.ioQuery("keyboard", "getKeyIsDown", [key1]);
            const isKey2Down = util.ioQuery("keyboard", "getKeyIsDown", [key2]);
            return isKey1Down && isKey2Down;
        }

        bgHaColBOOL(args, util) {
            const hex = args.color.replace('#', '');
            const targetRgb = [
                parseInt(hex.substring(0, 2), 16), 
                parseInt(hex.substring(2, 4), 16), 
                parseInt(hex.substring(4, 6), 16)
            ];
            const stage = Scratch.vm.runtime.getTargetForStage();
            const costume = stage.sprite.costumes[stage.currentCostume];
            if (!costume) return false;
            const cacheKey = costume.assetId; 
            if (this.bgColorCache[cacheKey]) {
                const data = this.bgColorCache[cacheKey];
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i + 3] > 0) { 
                        if (Math.abs(data[i] - targetRgb[0]) <= 10 &&
                            Math.abs(data[i + 1] - targetRgb[1]) <= 10 &&
                            Math.abs(data[i + 2] - targetRgb[2]) <= 10) {
                            return true;
                        }
                    }
                }
                return false;
            }
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    this.bgColorCache[cacheKey] = imgData.data; 
                    for (let i = 0; i < imgData.data.length; i += 4) {
                        if (imgData.data[i + 3] > 0) { 
                            if (Math.abs(imgData.data[i] - targetRgb[0]) <= 10 &&
                                Math.abs(imgData.data[i + 1] - targetRgb[1]) <= 10 &&
                                Math.abs(imgData.data[i + 2] - targetRgb[2]) <= 10) {
                                resolve(true);
                                return;
                            }
                        }
                    }
                    resolve(false);
                };
                img.onerror = () => resolve(false);
                img.src = costume.asset.encodeDataURI();
            });
        }

        powREP(args) {
            const a = Number(args.a);
            const b = Number(args.b);
            if (isNaN(a) || isNaN(b)) return 0;
            return Math.pow(a, b);
        }

        rootREP(args) {
            const a = Number(args.a);
            const b = Number(args.b);
            if (isNaN(a) || isNaN(b) || b === 0) return 0; 
            const result = Math.pow(a, 1 / b);
            if (isNaN(result)) return 0; 
            return result;
        }

        tereREP(args) {
            const text = String(args.text);
            const a = String(args.a);
            const b = String(args.b);
            if (!a) return text;
            return text.split(a).join(b);
        }

        deRepListCOM(args, util) {
            const listName = String(args.list).trim();
            if (!listName || listName === "无列表") return;
            const variable = util.target.lookupOrCreateList(listName, listName);
            if (!variable) return;
            const uniqueValues = [...new Set(variable.value)];
            variable.value = uniqueValues;
            util.runtime.requestUpdateMonitor({
                id: variable.id,
                value: variable.value
            });
            console.log(`🧹 列表 [${listName}] 去重完成，剩余 ${uniqueValues.length} 个元素。`);
        }

        speakTextCOM(args) {
            const text = String(args.text);
            const rate = Number(args.rate) || 1;
            if (!text) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = Math.max(0.1, Math.min(10, rate));
            const voices = window.speechSynthesis.getVoices();
            const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'));
            if (zhVoice) {
                utterance.voice = zhVoice;
            }
            window.speechSynthesis.speak(utterance);
            console.log(`🗣️ 正在朗读: ${text} (语速: ${utterance.rate})`);
        }

        stopSpeakCOM() {
            window.speechSynthesis.cancel();
            console.log("🔇 已停止朗读");
        }
    }

    Scratch.extensions.register(new ScratchMore());

})(Scratch);