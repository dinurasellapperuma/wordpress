"use strict";
var _a;
{
    //
    class VUE_APP {
        static generateId() {
            return (Math.random() + 1).toString(36).slice(-6);
        }
        constructor(getAppData) {
            this.getAppData = getAppData;
        }
        get state() {
            var _a, _b, _c;
            return (_c = (_b = (_a = this.getAppData()) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.globalProperties) === null || _c === void 0 ? void 0 : _c.$_state;
        }
        getElements() {
            return [...this.state.content, ...this.state.header, ...this.state.footer];
        }
        getElementById(id) {
            return this.getElements().find((el) => el.id === id);
        }
        getElementLabel(name) {
            if (!name)
                return;
            return name.replace(/\([^)]*\)/g, "")
                .replace(/\[[^\]]*]/g, "")
                .replace(/[^a-zA-z0-9-_ ]/g, "")
                .replace(/\s+/g, "-")
                .trim()
                .toLowerCase();
        }
        addClass(className, elementId) {
            var _a;
            let element = this.getElementById(elementId);
            if (!element)
                return;
            let existingClasses = (_a = element === null || element === void 0 ? void 0 : element.settings) === null || _a === void 0 ? void 0 : _a._cssGlobalClasses;
            let classExists = false;
            let classId = VUE_APP.generateId();
            this.state.globalClasses.forEach((cls) => {
                if (cls.name === className) {
                    classExists = true;
                    classId = cls.id;
                }
                else if (cls.id === classId) {
                    classId = VUE_APP.generateId();
                }
            });
            if (!classExists) {
                const newClass = {
                    id: classId,
                    name: className,
                    settings: []
                };
                this.state.globalClasses.push(newClass);
            }
            if (!existingClasses) {
                if (!element.settings)
                    element.settings = {};
                element.settings._cssGlobalClasses = [];
                existingClasses = element.settings._cssGlobalClasses;
            }
            if (!(existingClasses === null || existingClasses === void 0 ? void 0 : existingClasses.includes(classId))) {
                existingClasses.push(classId);
            }
            return true;
        }
        getElementTree(elementId) {
            const element = this.getElementById(elementId);
            if (!element)
                return null;
            const tree = {
                id: element.id,
                name: element.label || element.name,
                bemName: this.getElementLabel(element.label || element.name),
                rootName: this.getElementLabel(element.label || element.name),
                isRoot: true,
                children: []
            };
            if (element.children && Array.isArray(element.children)) {
                element.children.forEach((childId) => {
                    const childTree = this.getElementTree(childId);
                    if (childTree) {
                        childTree.isRoot = false;
                        childTree.rootName = tree.rootName;
                        tree.children.push(childTree);
                    }
                });
            }
            return tree;
        }
        renderTree(node) {
            const isRoot = node.isRoot;
            const rootName = node.rootName;
            const bemClass = isRoot ? node.bemName : `${rootName}__${node.bemName}`;
            let bemTreeItem = `
                <div class="bem-tree-item" data-element-id="${node.id}">
                    <span class="label-inline">
                        <span class="element-label--label">Label</span>
                        <span class="element-name">${node.name}</span>
                    </span>
                    <input 
                        type="text" 
                        class="bem-name-input" 
                        value="${bemClass}" 
                       data-is-root="${isRoot}"
                       data-root-name="${rootName}"
                   />
                </div>
            `;
            if (node.children.length) {
                bemTreeItem += '<div class="bem-tree-children">';
                node.children.forEach((child) => {
                    child.rootName = rootName;
                    bemTreeItem += this.renderTree(child);
                });
                bemTreeItem += '</div>';
            }
            return bemTreeItem;
        }
        showBemPopup(elementId) {
            var _a, _b, _c;
            const existingPopup = document.querySelector('.bem-popup-wrapper');
            const bemTree = this.getElementTree(elementId);
            existingPopup && existingPopup.remove();
            if (!bemTree)
                return;
            const popupWrapper = document.createElement('div');
            const glow = document.createElement('div');
            const popup = document.createElement('div');
            popupWrapper.className = 'bem-popup-wrapper';
            glow.className = 'bem-popup-glow';
            popup.className = 'bem-popup';
            popup.innerHTML = `
                <div class="bem-header">
                    <span class="bem-header--svg">
                    <svg 
                        id="b" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 31.82 24.84"
                    >
                    <defs>
                        <linearGradient id="e" x1="3.77" y1="7.44" x2="31.03" y2="24.04" 
                            gradientTransform="translate(0 26) scale(1 -1)" 
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stop-color="#5c68f9"></stop>
                            <stop offset="1" stop-color="#8e97fe"></stop>
                        </linearGradient>
                        <linearGradient id="f" x1="8.16" y1=".31" x2="13.63" y2="17.26" 
                            gradientTransform="translate(0 26) scale(1 -1)" 
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stop-color="#5c68f9" stop-opacity="0"></stop>
                            <stop offset=".08" stop-color="#5561f4" stop-opacity=".1"></stop>
                            <stop offset=".32" stop-color="#434ce6" stop-opacity=".42"></stop>
                            <stop offset=".55" stop-color="#343cdc" stop-opacity=".67"></stop>
                            <stop offset=".74" stop-color="#2930d4" stop-opacity=".85"></stop>
                            <stop offset=".9" stop-color="#2329cf" stop-opacity=".96"></stop>
                            <stop offset="1" stop-color="#2127ce"></stop>
                        </linearGradient>
                    </defs>
                    <g id="c">
                        <g id="d">
                            <rect x="18.78" y="10.68" width="13.03" height="7.07" style="fill:#a4a4a4;"></rect>
                            <path d="m12.42,0C5.56,0,0,5.56,0,12.42h0c0,6.86,5.56,12.42,12.42,12.42h6.37v-7.07h-6.37c-2.95,0-5.35-2.39-5.35-5.35h0c0-2.95,2.39-5.35,5.35-5.35h19.4V0H12.42Z" style="fill:#bcbcbc;"></path>
                            <path d="m7.07,12.42h0c0-1.23.43-2.35,1.13-3.25h-.02L.74,16.6c1.72,4.79,6.3,8.23,11.68,8.23h6.37v-7.07h-6.37c-2.95,0-5.35-2.39-5.35-5.35h0Z" style="fill:#919191;"></path>
                        </g>
                    </g>
                </svg>
                    </span>
                    <h3>BEM Class Generator</h3>
                    <button class="bem-close">✕</button>
                </div>
                <div class="bem-content">
                    <div class="bem-section">
                        <div class="bem-tree"></div>
                    </div>
                </div>
                <div class="bem-footer">
                    <button class="bem-button secondary bem-cancel">Cancel</button>
                    <button class="bem-button bem-apply">Apply Classes</button>
                </div>
            `;
            popupWrapper.appendChild(glow);
            popupWrapper.appendChild(popup);
            document.body.appendChild(popupWrapper);
            const header = popup.querySelector('.bem-header');
            const cleanupDraggable = this.initDragging(header, popupWrapper);
            const bemTreeContainer = popup.querySelector('.bem-tree');
            bemTreeContainer.innerHTML = this.renderTree(bemTree);
            bemTreeContainer.addEventListener('input', (e) => {
                const target = e.target;
                if (target === null || target === void 0 ? void 0 : target.classList.contains('bem-name-input')) {
                    const isRoot = target.dataset.isRoot === 'true';
                    if (isRoot) {
                        const newRoot = target.value;
                        const childInputs = bemTreeContainer
                            .querySelectorAll('.bem-name-input:not([data-is-root="true"])');
                        childInputs.forEach((input) => {
                            const elementName = input.value.split('__').pop();
                            input.value = `${newRoot}__${elementName}`;
                        });
                    }
                }
            });
            const removePopup = () => {
                cleanupDraggable();
                popupWrapper.remove();
            };
            (_a = popup.querySelector('.bem-close')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', removePopup);
            (_b = popup.querySelector('.bem-cancel')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', removePopup);
            (_c = popup.querySelector('.bem-apply')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => {
                const elements = bemTreeContainer === null || bemTreeContainer === void 0 ? void 0 : bemTreeContainer.querySelectorAll('.bem-tree-item');
                elements === null || elements === void 0 ? void 0 : elements.forEach((element) => {
                    const elementId = element.dataset.elementId;
                    const className = element.querySelector('.bem-name-input').value;
                    console.log(className, elementId);
                    elementId && this.addClass(className, elementId);
                });
                removePopup();
                this.state.updating = Date.now();
            });
        }
        addBemButton(element) {
            const vueApp = this;
            const actionsList = element.querySelector(".actions");
            const titleDiv = element.querySelector(".title");
            if (!actionsList && !titleDiv)
                return;
            if (actionsList) {
                if (actionsList.querySelector(".bem-generator"))
                    return;
            }
            else {
                if (titleDiv === null || titleDiv === void 0 ? void 0 : titleDiv.querySelector(".bem-generator"))
                    return;
            }
            const bemButton = document.createElement("span");
            bemButton.innerHTML = `
                <svg 
                    id="b" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 31.82 24.84"
                >
                    <defs>
                        <linearGradient id="e" x1="3.77" y1="7.44" x2="31.03" y2="24.04" gradientTransform="translate(0 26) scale(1 -1)" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#5c68f9"></stop>
                            <stop offset="1" stop-color="#8e97fe"></stop>
                        </linearGradient>
                        <linearGradient id="f" x1="8.16" y1=".31" x2="13.63" y2="17.26" gradientTransform="translate(0 26) scale(1 -1)" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stop-color="#5c68f9" stop-opacity="0"></stop>
                            <stop offset=".08" stop-color="#5561f4" stop-opacity=".1"></stop>
                            <stop offset=".32" stop-color="#434ce6" stop-opacity=".42"></stop>
                            <stop offset=".55" stop-color="#343cdc" stop-opacity=".67"></stop>
                            <stop offset=".74" stop-color="#2930d4" stop-opacity=".85"></stop>
                            <stop offset=".9" stop-color="#2329cf" stop-opacity=".96"></stop>
                            <stop offset="1" stop-color="#2127ce"></stop>
                        </linearGradient>
                    </defs>
                    <g id="c">
                        <g id="d">
                            <rect x="18.78" y="10.68" width="13.03" height="7.07" style="fill:#fa5e5e;"></rect>
                            <path d="m12.42,0C5.56,0,0,5.56,0,12.42h0c0,6.86,5.56,12.42,12.42,12.42h6.37v-7.07h-6.37c-2.95,0-5.35-2.39-5.35-5.35h0c0-2.95,2.39-5.35,5.35-5.35h19.4V0H12.42Z" style="fill:#7d87fc;"></path>
                            path d="m7.07,12.42h0c0-1.23.43-2.35,1.13-3.25h-.02L.74,16.6c1.72,4.79,6.3,8.23,11.68,8.23h6.37v-7.07h-6.37c-2.95,0-5.35-2.39-5.35-5.35h0Z" style="fill:#424ae1;"></path>
                        </g>
                    </g>
                </svg>
            `;
            bemButton.classList.add("bricks-svg-wrapper", "bem-generator");
            bemButton.setAttribute("title", "Add BEM Classes");
            bemButton.addEventListener("click", (e) => {
                var _a;
                e.preventDefault();
                e.stopPropagation();
                const elementId = (_a = element === null || element === void 0 ? void 0 : element.closest(".bricks-draggable-item")) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id");
                elementId && vueApp.showBemPopup(elementId);
            });
            if (actionsList) {
                const bemActionLi = document.createElement("li");
                bemActionLi.classList.add("action", "bem");
                bemActionLi.style.width = "22px";
                bemActionLi.append(bemButton);
                actionsList.append(bemActionLi);
            }
            else if (titleDiv) {
                const iconDiv = titleDiv.querySelector(".icon");
                iconDiv && iconDiv.insertAdjacentElement('afterend', bemButton);
            }
        }
        applyBemButtomToPanelElements() {
            const vueApp = this;
            document.querySelectorAll('.structure-item').forEach(this.addBemButton.bind(vueApp));
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node instanceof HTMLElement) {
                            if (node.classList.contains('structure-item')) {
                                this.addBemButton.bind(vueApp, node)();
                            }
                            if (node.querySelectorAll) {
                                node.querySelectorAll('.structure-item').forEach((childNode) => {
                                    this.addBemButton.bind(vueApp, childNode)();
                                });
                            }
                        }
                    });
                });
            });
            const structurePanel = document.querySelector('#bricks-structure');
            structurePanel && observer.observe(structurePanel, { childList: true, subtree: true });
        }
        initDragging(header, popupWrapper) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX = 0;
            let initialY = 0;
            let xOffset = 0;
            let yOffset = 0;
            function startDragging(e) {
                const target = e.target;
                if (target.classList.contains('bem-close') || target.closest('svg'))
                    return;
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
                header.style.cursor = 'grabbing';
            }
            function drag(e) {
                if (!isDragging)
                    return;
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                popupWrapper.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
            }
            function stopDragging() {
                isDragging = false;
                header.style.cursor = 'move';
            }
            header.addEventListener('mousedown', startDragging);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDragging);
            return () => {
                header.removeEventListener('mousedown', startDragging);
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', stopDragging);
            };
        }
    }
    // @ts-ignore
    if ((_a = window === null || window === void 0 ? void 0 : window.core_framework_connector) === null || _a === void 0 ? void 0 : _a.bricks_bem_generator) {
        const getDynamicAppData = () => { var _a; return (_a = document === null || document === void 0 ? void 0 : document.querySelector(".brx-body")) === null || _a === void 0 ? void 0 : _a.__vue_app__; };
        const app = new VUE_APP(getDynamicAppData);
        const checkBricksReady = setInterval(() => {
            if (getDynamicAppData()) {
                clearInterval(checkBricksReady);
                app.applyBemButtomToPanelElements();
            }
        }, 500);
    }
}
