"use strict";
var ThemeClasses;
(function (ThemeClasses) {
    ThemeClasses["DARK"] = "cf-theme-dark";
    ThemeClasses["LIGHT"] = "cf-theme-light";
})(ThemeClasses || (ThemeClasses = {}));
{
    const VUE = {
        vue: () => { var _a; return (_a = document === null || document === void 0 ? void 0 : document.querySelector(".brx-body")) === null || _a === void 0 ? void 0 : _a.__vue_app__; },
        config: () => { var _a, _b; return (_b = (_a = document.querySelector(".brx-body")) === null || _a === void 0 ? void 0 : _a.__vue_app__) === null || _b === void 0 ? void 0 : _b.config; },
        globalProperties: () => { var _a, _b, _c; return (_c = (_b = (_a = document.querySelector(".brx-body")) === null || _a === void 0 ? void 0 : _a.__vue_app__) === null || _b === void 0 ? void 0 : _b.config) === null || _c === void 0 ? void 0 : _c.globalProperties; },
    };
    const IFRAME_ID = "bricks-builder-iframe";
    const DEFAULT_CORE_FRAMEWORK_CONNECTOR = {
        theme_mode: "light",
        bricks_enable_dark_mode_preview: true,
        bricks_enable_variable_dropdown: true,
        bricks_variable_ui: true,
        bricks_enable_variable_ui_auto_hide: true,
        bricks_enable_variable_ui_hint: true,
        bricks_apply_class_on_hover: true,
        bricks_apply_variable_on_hover: true,
        bricks_enable_variable_context_menu: true,
        oxygen_enable_variable_dropdown: true,
        oxygen_enable_dark_mode_preview: true,
        oxygen_enable_variable_ui_auto_hide: true,
        oxygen_variable_ui: true,
        oxygen_enable_variable_context_menu: true,
        oxygen_enable_variable_ui_hint: true,
        oxygen_apply_class_on_hover: true,
        oxygen_enable_unit_and_value_preview: true,
    };
    const bricksInputs = {
        includedFields: [
            'div[data-control="number"]',
            {
                selector: 'div[data-control="text"]',
                hasChild: [
                    "#_cssTransition",
                    "#_transformOrigin",
                    "#_flexBasis",
                    "#_overflow",
                    "#_gridTemplateColumns",
                    "#_gridTemplateRows",
                    "#_gridAutoColumns",
                    "#_gridAutoRows",
                    "#_objectPosition",
                    '[id^="raw-"]',
                ],
            },
        ],
        excludedFields: [
            ".control-query",
            'div[data-controlkey="start"]',
            'div[data-controlkey="perPage"]',
            'div[data-controlkey="perMove"]',
            'div[data-controlkey="speed"]',
        ],
    };
    const observe = ({ selector, callback, options, }) => {
        const observer = new MutationObserver(callback);
        const target = document.querySelector(selector);
        if (!target) {
            log(`Target not found for selector: ${selector}`);
            return;
        }
        const DEFAULT_OPTIONS = {
            childList: true,
            subtree: true,
        };
        observer.observe(target, Object.assign(Object.assign({}, DEFAULT_OPTIONS), options));
    };
    const getCoreFrameworkConnector = () => { var _a; return (_a = window === null || window === void 0 ? void 0 : window.core_framework_connector) !== null && _a !== void 0 ? _a : DEFAULT_CORE_FRAMEWORK_CONNECTOR; };
    const assertOption = (feature) => { var _a, _b; return (_b = (_a = getCoreFrameworkConnector()) === null || _a === void 0 ? void 0 : _a[feature]) !== null && _b !== void 0 ? _b : false; };
    const log = (message, ...args) => console.log(`[Core Framework] ${message}`, ...args);
    const addThemeToggleButton = () => {
        var _a, _b, _c, _d;
        if (!assertOption("bricks_enable_dark_mode_preview")) {
            return;
        }
        const themeMode = (_b = (_a = window === null || window === void 0 ? void 0 : window.core_framework_connector) === null || _a === void 0 ? void 0 : _a.theme_mode) !== null && _b !== void 0 ? _b : "light";
        const leftPanel = document.querySelector("#bricks-toolbar .group-wrapper.left");
        const THEME_TOGGLE_BUTTON_CLASS = "cf-theme-toggle-button";
        const BUILDER_TOGGLE_BUTTON_ICON_LIGHT = `
			<svg xmlns="http://www.w3.org/2000/svg" class="cf-theme-toggle-button-icon bricks-svg" viewBox="0 0 512 512">
				<path fill="currentColor" stroke="currentColor" d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391l-19.9 107.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121l19.9-107.9c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1l90.3-62.3c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 11192 0 96 96 0 11-192 0zm224 0a128 128 0 10-256 0 128 128 0 10256 0"></path>
			</svg>
		`;
        const BUILDER_TOGGLE_BUTTON_ICON_DARK = `
			<svg xmlns="http://www.w3.org/2000/svg" class="cf-theme-toggle-button-icon bricks-svg" viewBox="0 0 384 512">
				<path fill="currentColor" stroke="currentColor" d="M223.5 32C100 32 0 132.3 0 256s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
			</svg>
		`;
        if (!leftPanel) {
            log("Left panel not found");
            return;
        }
        const toggleButton = (_c = leftPanel.querySelector("li.settings")) === null || _c === void 0 ? void 0 : _c.cloneNode(true);
        if (!toggleButton) {
            log("Button not found");
            return;
        }
        toggleButton.classList.remove("settings");
        toggleButton.classList.add("theme-toggle");
        toggleButton.setAttribute("data-balloon", "Toggle Core Framework theme");
        const svg = toggleButton.querySelector("svg");
        svg === null || svg === void 0 ? void 0 : svg.remove();
        const span = toggleButton.querySelector("span");
        leftPanel.appendChild(toggleButton);
        const getSystemThemeClass = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? ThemeClasses.DARK
            : ThemeClasses.LIGHT;
        (_d = document.getElementById(IFRAME_ID)) === null || _d === void 0 ? void 0 : _d.addEventListener("load", () => setTimeout(() => {
            var _a, _b, _c, _d, _e;
            const iframeDocument = (_a = document.getElementById(IFRAME_ID)) === null || _a === void 0 ? void 0 : _a.contentDocument;
            const iframeHtml = iframeDocument === null || iframeDocument === void 0 ? void 0 : iframeDocument.querySelector("html");
            const html = document.querySelector("html");
            if (iframeDocument && iframeHtml) {
                iframeHtml.classList.remove(...[ThemeClasses.DARK, ThemeClasses.LIGHT]);
                (_b = html === null || html === void 0 ? void 0 : html.classList) === null || _b === void 0 ? void 0 : _b.remove(...[ThemeClasses.DARK, ThemeClasses.LIGHT]);
                const savedTheme = (_c = window === null || window === void 0 ? void 0 : window.localStorage) === null || _c === void 0 ? void 0 : _c.getItem("cf-theme");
                const defaultTheme = String(themeMode === "auto" ? getSystemThemeClass() : `cf-theme-${themeMode}`);
                iframeHtml.classList.add(savedTheme ? `cf-theme-${savedTheme}` : defaultTheme);
                (_d = html === null || html === void 0 ? void 0 : html.classList) === null || _d === void 0 ? void 0 : _d.add(savedTheme ? `cf-theme-${savedTheme}` : defaultTheme);
            }
            if (span) {
                span.innerHTML = ((_e = html === null || html === void 0 ? void 0 : html.classList) === null || _e === void 0 ? void 0 : _e.contains(ThemeClasses.DARK))
                    ? BUILDER_TOGGLE_BUTTON_ICON_LIGHT
                    : BUILDER_TOGGLE_BUTTON_ICON_DARK;
            }
            if (!iframeDocument) {
                log("Iframe document not found");
                return;
            }
            [...iframeDocument.getElementsByClassName(THEME_TOGGLE_BUTTON_CLASS)].forEach((button) => {
                var _a;
                button.classList.add(((_a = html === null || html === void 0 ? void 0 : html.classList) === null || _a === void 0 ? void 0 : _a.contains(ThemeClasses.DARK)) ? ThemeClasses.LIGHT : ThemeClasses.DARK);
            });
        }, 5));
        toggleButton.addEventListener("click", (e) => {
            var _a, _b, _c, _d;
            e.preventDefault();
            e.stopPropagation();
            const iframeDocument = (_a = document.getElementById(IFRAME_ID)) === null || _a === void 0 ? void 0 : _a.contentDocument;
            if (!iframeDocument) {
                log("Iframe document not found");
                return;
            }
            const iframeHtml = iframeDocument.querySelector("html");
            const html = document.querySelector("html");
            if (!iframeHtml) {
                log("Iframe html not found");
                return;
            }
            iframeHtml.classList.toggle(ThemeClasses.DARK);
            iframeHtml.classList.toggle(ThemeClasses.LIGHT);
            (_b = html === null || html === void 0 ? void 0 : html.classList) === null || _b === void 0 ? void 0 : _b.toggle(ThemeClasses.DARK);
            (_c = html === null || html === void 0 ? void 0 : html.classList) === null || _c === void 0 ? void 0 : _c.toggle(ThemeClasses.LIGHT);
            const icon = toggleButton.querySelector(".theme-toggle span");
            if (icon) {
                icon.innerHTML = iframeHtml.classList.contains(ThemeClasses.DARK)
                    ? BUILDER_TOGGLE_BUTTON_ICON_LIGHT
                    : BUILDER_TOGGLE_BUTTON_ICON_DARK;
            }
            const isDark = iframeHtml.classList.contains(ThemeClasses.DARK);
            (_d = window === null || window === void 0 ? void 0 : window.localStorage) === null || _d === void 0 ? void 0 : _d.setItem("cf-theme", isDark ? "dark" : "light");
            [...iframeDocument.getElementsByClassName(THEME_TOGGLE_BUTTON_CLASS)].forEach((button) => {
                const classes = [...button.classList].filter((c) => ![ThemeClasses.DARK, ThemeClasses.LIGHT].includes(c));
                classes.push(isDark ? ThemeClasses.LIGHT : ThemeClasses.DARK);
                button.className = classes.join(" ");
            });
        });
    };
    const applyClassOnHover = () => {
        var _a, _b;
        const globalProperties = VUE.globalProperties();
        if (globalProperties.$_state.activePanel !== "element") {
            return;
        }
        const activeElement = (_a = globalProperties.$_state) === null || _a === void 0 ? void 0 : _a.activeElement;
        const activeElementId = activeElement === null || activeElement === void 0 ? void 0 : activeElement.id;
        if (!activeElementId) {
            return;
        }
        const iframeWindow = (_b = document.getElementById(IFRAME_ID)) === null || _b === void 0 ? void 0 : _b.contentWindow;
        if (!iframeWindow) {
            return;
        }
        const activeElementIdSelector = activeElement.settings._cssId
            ? `#${activeElement.settings._cssId}`
            : `#brxe-${activeElementId}`;
        const activeElementSelector = iframeWindow.document.querySelector(activeElementIdSelector);
        const titleArr = document.querySelectorAll("div.bricks-control-popup > div.css-classes > h6");
        if (titleArr.length < 1) {
            return;
        }
        const title = titleArr[titleArr.length - 1];
        if (!title || !activeElementSelector) {
            return;
        }
        const ul = title.nextElementSibling;
        const globalClasses = ul === null || ul === void 0 ? void 0 : ul.querySelectorAll("li");
        globalClasses === null || globalClasses === void 0 ? void 0 : globalClasses.forEach((singleClass) => {
            singleClass.onmouseenter = () => {
                const sClass = singleClass.querySelector("div.actions");
                if (!sClass) {
                    return;
                }
                const sibling = sClass.previousElementSibling;
                const name = sibling === null || sibling === void 0 ? void 0 : sibling.textContent;
                if (!name) {
                    return;
                }
                activeElementSelector.classList.add(name.substring(1));
            };
            singleClass.onmouseleave = () => {
                const sClass = singleClass.querySelector("div.actions");
                if (!singleClass) {
                    return;
                }
                const sibling = sClass === null || sClass === void 0 ? void 0 : sClass.previousElementSibling;
                const name = sibling === null || sibling === void 0 ? void 0 : sibling.textContent;
                if (!name) {
                    return;
                }
                activeElementSelector.classList.remove(name.substring(1));
            };
            singleClass.onclick = () => {
                const sClass = singleClass.querySelector("div.actions");
                if (!singleClass) {
                    return;
                }
                const sibling = sClass === null || sClass === void 0 ? void 0 : sClass.previousElementSibling;
                const name = sibling === null || sibling === void 0 ? void 0 : sibling.textContent;
                if (!name) {
                    return;
                }
                activeElementSelector.classList.remove(name.substring(1));
            };
        });
    };
    const initApplyClassOnHover = () => {
        if (!assertOption("bricks_apply_class_on_hover")) {
            return;
        }
        const innerPanel = document.querySelector("#bricks-panel-inner:not(div.bricks-control-popup *)");
        if (!innerPanel) {
            log("Inner panel not found, can't initialize preview of classes on hover");
            return;
        }
        const observer = new MutationObserver(applyClassOnHover);
        observer.observe(innerPanel, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["class"],
        });
    };
    // Preview variables on hover
    const applyVariableOnHover = () => {
        var _a, _b, _c, _d;
        const globalProperties = VUE.globalProperties();
        if (globalProperties.$_state.activePanel !== "element")
            return;
        const activeElement = (_a = globalProperties.$_state) === null || _a === void 0 ? void 0 : _a.activeElement;
        const activeElementId = activeElement === null || activeElement === void 0 ? void 0 : activeElement.id;
        if (!activeElementId)
            return;
        const iframeWindow = (_b = document.getElementById(IFRAME_ID)) === null || _b === void 0 ? void 0 : _b.contentWindow;
        if (!iframeWindow)
            return;
        const wrapper = document.querySelector('.expand .options-wrapper');
        const searchInput = wrapper === null || wrapper === void 0 ? void 0 : wrapper.querySelector('.searchable');
        const dropdown = wrapper === null || wrapper === void 0 ? void 0 : wrapper.querySelector('.dropdown');
        const hoveredItems = dropdown === null || dropdown === void 0 ? void 0 : dropdown.querySelectorAll('.variable-picker-item:not(.title)');
        const focusedInput = (_c = document.querySelector('.variable-picker-button.open')) === null || _c === void 0 ? void 0 : _c.previousElementSibling;
        if (!focusedInput || !(hoveredItems === null || hoveredItems === void 0 ? void 0 : hoveredItems.length) || !wrapper || !dropdown || !searchInput)
            return;
        // Function to handle mouseenter event
        const handleMouseEnter = (item) => {
            var _a, _b;
            const content = (_b = (_a = item.querySelector('span:first-of-type')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : '';
            if (!focusedInput || !content)
                return;
            triggerPreview(valueToVar(content));
        };
        // Function to handle click event
        const handleClick = (item) => {
            var _a, _b;
            const content = (_b = (_a = item.querySelector('span:first-of-type')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : '';
            if (!focusedInput || !content)
                return;
            tempValue = valueToVar(content);
            focusedInput.value = valueToVar(content);
            focusedInput.click();
        };
        // Observer to reopen dropdown on mouseleave
        const observerCallBack = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('open')) {
                    const target = entry.target;
                    target.click();
                }
            });
        };
        // Reopen dropdown
        const reOpenDropdown = () => {
            triggerPreview(tempValue);
            const btn = focusedInput.nextElementSibling;
            observer.observe(btn);
            wrapper.removeEventListener('mouseleave', reOpenDropdown);
        };
        // Function to create and insert list items
        const insertItems = (items, container) => {
            items.forEach(variable => {
                const [key, value] = Object.entries(variable)[0] || [];
                container.insertAdjacentHTML('beforeend', `
					<li class="variable-picker-item">
						<span>${key}</span>
						<span class="option-value">${value}</span>
					</li>
				`);
            });
            // Add events to items
            const variableItems = customDropdown.querySelectorAll('.variable-picker-item');
            variableItems.forEach(item => {
                item.addEventListener('mouseenter', () => handleMouseEnter(item));
                item.addEventListener('click', () => handleClick(item));
            });
        };
        // Function to show preview
        const triggerPreview = (value) => {
            focusedInput.value = value;
            focusedInput.dispatchEvent(new Event("input"));
            focusedInput.focus();
        };
        // String to css var
        const valueToVar = (value) => `var(--${value})`;
        // Variables: [{ name: value }]
        const variables = [];
        // remove native dropdown
        dropdown.remove();
        // Get option values
        hoveredItems.forEach(item => {
            var _a, _b, _c, _d;
            const name = (_b = (_a = item.querySelector('span:first-of-type')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : '';
            const content = (_d = (_c = item.querySelector('span.option-value')) === null || _c === void 0 ? void 0 : _c.textContent) !== null && _d !== void 0 ? _d : '';
            variables.push({ [name]: content });
        });
        // Create and append custom dropdown
        const customDropdown = document.createElement('ul');
        customDropdown.classList.add('custom-dropdown');
        const styles = `
			max-height: calc(32px * 10);
			overflow: hidden;
			overflow-y: auto;
			position: relative;
			scrollbar-color: rgba(0, 0, 0, .4) rgba(0, 0, 0, .2);
			scrollbar-width: thin;
		`;
        customDropdown.setAttribute('style', styles);
        insertItems(variables, customDropdown);
        wrapper.appendChild(customDropdown);
        searchInput.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        // Search in dropdown
        searchInput.addEventListener('input', (e) => {
            const filteredItems = variables.filter(variable => {
                var _a, _b;
                const key = (_b = (_a = Object.keys(variable)[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : '';
                return key.includes(searchInput.value.toLowerCase());
            });
            customDropdown.innerHTML = '';
            insertItems(filteredItems, customDropdown);
        });
        // Temp value for input
        let tempValue = (_d = focusedInput.value) !== null && _d !== void 0 ? _d : ' ';
        // Create observer
        const observer = new IntersectionObserver(observerCallBack, {
            root: focusedInput.parentElement
        });
        // Events
        // Reset input on mouse leave
        wrapper.addEventListener('mouseleave', reOpenDropdown);
        observer.disconnect();
    };
    const initApplyVariableOnHover = () => {
        if (!assertOption("bricks_apply_variable_on_hover")) {
            return;
        }
        const innerPanel = document.querySelector("#bricks-panel-inner:not(div.bricks-control-popup *)");
        if (!innerPanel) {
            log("Inner panel not found, can't initialize preview of variables on hover");
            return;
        }
        const observer = new MutationObserver(applyVariableOnHover);
        observer.observe(innerPanel, {
            subtree: true,
            childList: true,
            attributes: true
        });
    };
    class VariableAutoComplete {
        constructor() {
            this.variables = [];
            this.variablesGroups = {};
            this.colorVariables = [];
            this.previewOnHover = true;
            this.init();
            this.boundOnInputFocus = this.onInputFocus.bind(this);
        }
        async init() {
            var _a, _b, _c;
            if (!assertOption("bricks_enable_variable_dropdown")) {
                return;
            }
            if ((_c = (_b = (_a = window === null || window === void 0 ? void 0 : window.ADMINBRXC) === null || _a === void 0 ? void 0 : _a.globalSettings) === null || _b === void 0 ? void 0 : _b.classFeatures) === null || _c === void 0 ? void 0 : _c.includes("autocomplete-variable")) {
                log("Autocomplete variable feature already enabled in Advanced Themer. Only one instance of this feature can be enabled at a time.");
                return;
            }
            const didLoadVariables = await this.getVariables();
            if (!didLoadVariables) {
                return;
            }
            const innerPanel = document.querySelector("#bricks-panel-inner");
            if (!innerPanel) {
                return;
            }
            const TIMEOUT = 100;
            let isObserverRunning = false;
            const observer = new MutationObserver(() => {
                if (isObserverRunning) {
                    return;
                }
                isObserverRunning = true;
                this.setVariableAutocomplete();
                setTimeout(() => {
                    isObserverRunning = false;
                }, TIMEOUT);
            });
            observer.observe(innerPanel, {
                subtree: true,
                childList: true,
            });
        }
        autoComplete({ input, variables, type, ignorePreview = false, }) {
            const self = this;
            let currentFocus = 0;
            if (input.dataset.autocomplete === "true")
                return;
            function addActive(elements) {
                var _a;
                if (!elements.length) {
                    return false;
                }
                removeActive(elements);
                if (currentFocus >= elements.length) {
                    currentFocus = 0;
                }
                if (currentFocus < 0) {
                    currentFocus = elements.length - 1;
                }
                (_a = elements[currentFocus]) === null || _a === void 0 ? void 0 : _a.classList.add("selected");
                const el = elements[currentFocus];
                el === null || el === void 0 ? void 0 : el.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "start",
                });
            }
            function removeActive(elements) {
                for (const element of elements) {
                    element.classList.remove("selected");
                }
            }
            function closeAllLists(element, tab) {
                var _a;
                const x = document.getElementsByClassName("autocomplete-items");
                for (const element2 of x) {
                    if (tab || (element != element2 && element !== input)) {
                        (_a = element2 === null || element2 === void 0 ? void 0 : element2.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element2);
                    }
                }
            }
            input.setAttribute("data-autocomplete", "true");
            function onKeyUp(e) {
                var _a, _b;
                if (e.metaKey || e.altKey || e.key === "Meta" || e.key === "Alt") {
                    return;
                }
                if (e.keyCode == 40 || e.keyCode == 38 || e.keyCode == 13) {
                    return;
                }
                let a;
                let b;
                let i;
                let j;
                let ul;
                const input = e.target;
                const val = input.value;
                closeAllLists();
                if (!val) {
                    return false;
                }
                currentFocus = -1;
                a = document.createElement("div");
                a.setAttribute("id", `autocomplete-list`);
                a.setAttribute("class", "autocomplete-items bricks-control-popup bottom cf-variable-autocomplete");
                a.style.gap = "0px";
                const displayHint = assertOption("bricks_enable_variable_ui_hint") && assertOption("bricks_variable_ui");
                if (displayHint) {
                    const hint = document.createElement("div");
                    hint.classList.add("cf-variable-dropdown-hint");
                    hint.classList.add("variable-dropdown-item");
                    hint.textContent = `Right-click to open Variable UI`;
                    hint.style.padding = "4px 10px";
                    hint.style.color = "var(var(--cf-ui--text), white)";
                    hint.style.opacity = "0.7";
                    hint.style.fontSize = "12px";
                    a.appendChild(hint);
                }
                (_a = input === null || input === void 0 ? void 0 : input.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(a);
                ul = document.createElement("ul");
                a.appendChild(ul);
                for (i = 0, j = 0; i < variables.length; i++) {
                    if ((_b = variables === null || variables === void 0 ? void 0 : variables[i]) === null || _b === void 0 ? void 0 : _b.toUpperCase().includes(val.toUpperCase())) {
                        j++;
                        b = document.createElement("li");
                        b.innerHTML += variables[i];
                        b.innerHTML += `<input type='hidden' value='${variables[i]}'>`;
                        b.addEventListener("click", function (e) {
                            var _a, _b;
                            input.value = String((_b = (_a = this === null || this === void 0 ? void 0 : this.getElementsByTagName("input")) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value);
                            const event = new Event("input", {
                                bubbles: true,
                                cancelable: true,
                            });
                            input.dispatchEvent(event);
                            closeAllLists();
                        });
                        if (self.previewOnHover === true && ignorePreview === false) {
                            let isMouseMoving = false;
                            b.addEventListener("mousemove", function (e) {
                                isMouseMoving = true;
                            });
                            b.addEventListener("mouseleave", function (e) {
                                setTimeout(() => {
                                    var _a;
                                    input.value = (_a = input.dataset.autocompleteInitial) !== null && _a !== void 0 ? _a : "";
                                    const event = new Event("input", {
                                        bubbles: false,
                                        cancelable: true,
                                    });
                                    input.dispatchEvent(event);
                                    input.removeAttribute("data-autocomplete-initial");
                                }, 0);
                            });
                            b.addEventListener("mouseenter", function (e) {
                                setTimeout(() => {
                                    var _a, _b;
                                    input.setAttribute("data-autocomplete-initial", input.value);
                                    if (isMouseMoving === false) {
                                        return;
                                    }
                                    input.value = String((_b = (_a = this.getElementsByTagName("input")) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value);
                                    const event = new Event("input", {
                                        bubbles: false,
                                        cancelable: true,
                                    });
                                    input.dispatchEvent(event);
                                    isMouseMoving = false;
                                }, 0);
                            });
                        }
                        ul.appendChild(b);
                    }
                }
                if (j === 0) {
                    closeAllLists();
                }
            }
            input.removeEventListener("keyup", onKeyUp);
            input.addEventListener("keyup", onKeyUp);
            const onKeyDown = (e) => {
                var _a, _b;
                const autoCompleteList = document.getElementById(`${input.id}autocomplete-list`);
                if (!autoCompleteList) {
                    return;
                }
                const autoCompleteListElements = [...autoCompleteList.getElementsByTagName("li")];
                switch (e.key) {
                    case "ArrowDown": {
                        e.preventDefault();
                        const hasMoreItems = autoCompleteListElements.length > 0 && autoCompleteListElements.length > currentFocus + 1;
                        if (!hasMoreItems) {
                            return;
                        }
                        currentFocus++;
                        addActive(autoCompleteListElements);
                        const active = autoCompleteListElements.find((el) => el.classList.contains("selected"));
                        const value = (active === null || active === void 0 ? void 0 : active.querySelector('input[type="hidden"]')).value;
                        input.value = value;
                        const event = new Event("input", {
                            bubbles: false,
                            cancelable: true,
                        });
                        input.dispatchEvent(event);
                        return;
                    }
                    case "ArrowUp": {
                        e.preventDefault();
                        const hasMoreItems = autoCompleteListElements.length && currentFocus - 1 >= 0;
                        if (!hasMoreItems) {
                            return;
                        }
                        currentFocus--;
                        addActive(autoCompleteListElements);
                        const active = autoCompleteListElements.find((el) => el.classList.contains("selected"));
                        const value = (_a = active === null || active === void 0 ? void 0 : active.querySelector('input[type="hidden"]')) === null || _a === void 0 ? void 0 : _a.value;
                        input.value = value;
                        const event = new Event("input", {
                            bubbles: false,
                            cancelable: true,
                        });
                        input.dispatchEvent(event);
                        return;
                    }
                    case "Enter": {
                        e.preventDefault();
                        if (currentFocus > -1 && autoCompleteListElements.length) {
                            (_b = autoCompleteListElements === null || autoCompleteListElements === void 0 ? void 0 : autoCompleteListElements[currentFocus]) === null || _b === void 0 ? void 0 : _b.click();
                        }
                        return;
                    }
                    case "Escape":
                    case "Tab": {
                        closeAllLists();
                    }
                }
            };
            input.removeEventListener("keydown", onKeyDown);
            input.addEventListener("keydown", onKeyDown);
            const onDocumentClick = (e) => {
                if (e.target === input) {
                    return;
                }
                closeAllLists();
            };
            document.removeEventListener("click", onDocumentClick);
            document.addEventListener("click", onDocumentClick);
        }
        sortVariables(input) {
            var _a, _b, _c;
            const control = input.closest("[data-controlkey]");
            const dataControlKey = (_a = control === null || control === void 0 ? void 0 : control.dataset.controlkey) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase();
            const isFontSize = ["typography", "font"].some((key) => dataControlKey === null || dataControlKey === void 0 ? void 0 : dataControlKey.includes(key));
            const isSpacing = ["padding", "margin", "gap", "width", "height"].some((key) => dataControlKey === null || dataControlKey === void 0 ? void 0 : dataControlKey.includes(key));
            const isColorPicker = (_c = (_b = input.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.classList.contains("color-input");
            let output = [];
            for (const [key, value] of Object.entries(this.variablesGroups)) {
                if (isColorPicker && key === "colorStyles") {
                    output = [...value];
                    break;
                }
                if (key === "colorStyles") {
                    continue;
                }
                if (isFontSize && key === "typographyStyles" && isFontSize) {
                    output.unshift(...value);
                    continue;
                }
                if (isFontSize && key === "typographyStyles" && !isFontSize) {
                    output.push(...value);
                    continue;
                }
                if (isSpacing && key === "spacingStyles" && isSpacing) {
                    output.unshift(...value);
                    continue;
                }
                if (isSpacing && key === "spacingStyles" && !isSpacing) {
                    output.push(...value);
                    continue;
                }
                output.push(...value);
            }
            output = output.map((v) => `var(--${v})`);
            this.variables = output;
            return output;
        }
        onInputFocus(e) {
            if (!e.isTrusted || (e === null || e === void 0 ? void 0 : e.metaKey) || (e === null || e === void 0 ? void 0 : e.altKey)) {
                return;
            }
            const input = e.target;
            if (!input) {
                return;
            }
            const variables = this.sortVariables(input);
            this.autoComplete({
                input,
                variables,
                type: "style",
            });
        }
        setVariableAutocomplete() {
            setTimeout(() => {
                bricksInputs.includedFields.forEach((field) => {
                    let elements;
                    if (typeof field === "string") {
                        elements = Array.from(document.querySelectorAll(field));
                    }
                    else {
                        const filteredElements = Array.from(document.querySelectorAll(field.selector));
                        elements = filteredElements.filter((el) => field.hasChild.some((child) => el.querySelector(child)));
                    }
                    const wrappers = elements.filter((item) => {
                        var _a, _b, _c;
                        return !((_b = (_a = item === null || item === void 0 ? void 0 : item.parentNode) === null || _a === void 0 ? void 0 : _a.closest) === null || _b === void 0 ? void 0 : _b.call(_a, (_c = bricksInputs === null || bricksInputs === void 0 ? void 0 : bricksInputs.excludedFields) === null || _c === void 0 ? void 0 : _c.join(","))) &&
                            !item.classList.contains("autocomplete-active");
                    });
                    wrappers.forEach((wrapper) => {
                        wrapper.classList.add("autocomplete-active");
                        const input = wrapper.querySelector("input[type='text']");
                        input === null || input === void 0 ? void 0 : input.removeEventListener("focus", this.boundOnInputFocus);
                        input === null || input === void 0 ? void 0 : input.addEventListener("focus", this.boundOnInputFocus);
                    });
                });
            }, 100);
        }
        async getVariables() {
            var _a;
            window.coreframework = {
                nonce: window.wpApiSettings.nonce,
                rest_url: window.wpApiSettings.root,
                core_api_url: `${window.wpApiSettings.root}core-framework/v2/`,
            };
            try {
                const res = await fetch(`${window.coreframework.core_api_url}get-variables?type=bricks_dropdown`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": window.coreframework.nonce,
                    },
                });
                if (res.status !== 200) {
                    log("Failed to load variables.");
                    return false;
                }
                const json = (await res.json());
                if (!(json === null || json === void 0 ? void 0 : json.variables)) {
                    log("No variables found. Please save changes again in the Core Framework plugin.");
                    return false;
                }
                this.variablesGroups = json.variables;
                this.colorVariables = ((_a = this.variablesGroups.colorStyles) !== null && _a !== void 0 ? _a : []).map((v) => `var(--${v})`);
                return true;
            }
            catch (e) {
                log("Failed to load variables.");
                console.error(e);
                return false;
            }
        }
    }
    class VariableUi {
        constructor() {
            this.variables = {};
            this.colorSystemData = null;
            this.variablePrefix = "";
            this.fluid_typography_naming_convention = null;
            this.fluid_spacing_naming_convention = null;
            this.recentColorPickerTarget = null;
            this.recentVariableSelectionTimestamp = 0;
            this.HOVER_VARIABLE_PREVIEW_TIMEOUT = 1000;
            this.instance = null;
            this.focusedInput = null;
            this.tempInputValue = null;
            this.isOpen = false;
            this.stylesGroupsLabelMap = {
                colorStyles: "Colors",
                typographyStyles: "Typography",
                spacingStyles: "Spacing",
                layoutsStyles: "Layouts",
                designStyles: "Design",
                componentsStyles: "Components",
                otherStyles: "Other",
            };
            this.logoData = "data:image/png;base64,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";
            this.init();
            this.boundOnInputClick = this.onInputClick.bind(this);
            this.boundOnFocusCallback = this.onFocusCallback.bind(this);
        }
        getActiveElement() {
            var _a;
            const globalProperties = VUE.globalProperties();
            if (globalProperties.$_state.activePanel !== "element") {
                return null;
            }
            const activeElementId = (_a = globalProperties.$_state) === null || _a === void 0 ? void 0 : _a.activeElement.id;
            const iframe = globalProperties.$_getIframeDoc();
            return iframe === null || iframe === void 0 ? void 0 : iframe.getElementById(`brxe-${activeElementId}`);
        }
        async init() {
            if (!assertOption("bricks_variable_ui")) {
                return;
            }
            const didLoadVariables = await this.getVariables();
            if (!didLoadVariables) {
                return;
            }
            const innerPanelId = "bricks-panel-inner";
            const innerPanel = document.getElementById(innerPanelId);
            if (!innerPanel) {
                return;
            }
            const TIMEOUT = 100;
            let isObserverRunning = false;
            observe({
                selector: `#${innerPanelId}`,
                options: {
                    subtree: true,
                    childList: true,
                },
                callback: () => {
                    if (isObserverRunning) {
                        return;
                    }
                    isObserverRunning = true;
                    this.addTriggers();
                    setTimeout(() => {
                        isObserverRunning = false;
                    }, TIMEOUT);
                },
            });
            this.createInstance();
            this.addTriggers();
            this.addListeners();
        }
        getPrefixedVariableName(variable) {
            return variable.startsWith(this.variablePrefix) ? variable : `${this.variablePrefix}${variable}`;
        }
        createVarButton({ variable, label, color, transparent, }) {
            const button = document.createElement("button");
            button.classList.add("cf-variable-ui-list-item");
            button.dataset.cftooltip = `var(--${variable})`;
            button.textContent = label !== null && label !== void 0 ? label : variable;
            if (color) {
                const span = document.createElement("span");
                span.style.backgroundColor = color;
                if (transparent) {
                    span.style.opacity = (transparent / 100).toString();
                }
                button.prepend(span);
            }
            button.addEventListener("click", () => {
                if (!this.focusedInput) {
                    return;
                }
                const variableParsed = variable.startsWith("var(--") ? variable : `var(--${variable})`;
                this.focusedInput.value = variableParsed;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
                this.tempInputValue = variableParsed;
                this.recentVariableSelectionTimestamp = performance.now();
                if (assertOption("bricks_enable_variable_ui_auto_hide")) {
                    this.close();
                }
            });
            button.addEventListener("mouseenter", () => {
                const timeElapsedBetweenSelections = performance.now() - this.recentVariableSelectionTimestamp;
                const isInCoolDown = timeElapsedBetweenSelections < this.HOVER_VARIABLE_PREVIEW_TIMEOUT;
                if (isInCoolDown) {
                    return;
                }
                if (!this.focusedInput) {
                    return;
                }
                const variableParsed = variable.startsWith("var(--") ? variable : `var(--${variable})`;
                this.focusedInput.value = variableParsed;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
            });
            button.addEventListener("mouseleave", () => {
                if (!this.focusedInput || this.tempInputValue === null) {
                    return;
                }
                this.focusedInput.value = this.tempInputValue;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
            });
            return button;
        }
        createVarWithValueButton({ variable, value, label, color, transparent, }) {
            const button = document.createElement("button");
            button.classList.add("cf-variable-ui-list-item");
            button.dataset.cftooltip = variable;
            button.textContent = label !== null && label !== void 0 ? label : variable;
            if (color) {
                const span = document.createElement("span");
                span.style.backgroundColor = color;
                if (transparent) {
                    span.style.opacity = (transparent / 100).toString();
                }
                button.prepend(span);
            }
            button.addEventListener("click", () => {
                if (!this.focusedInput) {
                    return;
                }
                this.focusedInput.value = value;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
                this.tempInputValue = value;
                this.recentVariableSelectionTimestamp = performance.now();
                if (assertOption("bricks_enable_variable_ui_auto_hide")) {
                    this.close();
                }
            });
            button.addEventListener("mouseenter", () => {
                const timeElapsedBetweenSelections = performance.now() - this.recentVariableSelectionTimestamp;
                const isInCoolDown = timeElapsedBetweenSelections < this.HOVER_VARIABLE_PREVIEW_TIMEOUT;
                if (isInCoolDown) {
                    return;
                }
                if (!this.focusedInput) {
                    return;
                }
                this.focusedInput.value = value;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
            });
            button.addEventListener("mouseleave", () => {
                if (!this.focusedInput || this.tempInputValue === null) {
                    return;
                }
                this.focusedInput.value = this.tempInputValue;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
            });
            return button;
        }
        createColorButton({ variable, color, id, darkColor, transparent, }) {
            variable = this.getPrefixedVariableName(variable);
            const button = document.createElement("button");
            button.dataset.cftooltip = `var(--${variable})`;
            button.classList.add("cf-variable-ui-list-item-color");
            if (color) {
                if (transparent !== undefined) {
                    button.style.padding = "0";
                    const div = document.createElement("div");
                    div.style.setProperty("--cf-variable-ui-color", color);
                    div.style.setProperty("--cf-variable-ui-color-dark", darkColor !== null && darkColor !== void 0 ? darkColor : color);
                    div.style.opacity = (transparent / 100).toString();
                    div.style.width = "100%";
                    div.style.height = "100%";
                    button.appendChild(div);
                }
                if (transparent === undefined) {
                    button.style.setProperty("--cf-variable-ui-color", color);
                    button.style.setProperty("--cf-variable-ui-color-dark", darkColor !== null && darkColor !== void 0 ? darkColor : color);
                }
            }
            button.addEventListener("click", async (e) => {
                e.stopPropagation();
                e.preventDefault();
                const variableString = variable.startsWith("var(--") ? variable : `var(--${variable})`;
                if (!this.focusedInput) {
                    // try {
                    // 	console.log(
                    // 		'🚀 ~ VariableUi ~ document.querySelector(".brx-body")?.__vue_app__?.config?.globalProperties:',
                    // 		// @ts-ignore
                    // 		document.querySelector(".brx-body")?.__vue_app__?.config?.globalProperties,
                    // 	);
                    // 	const globalPropertiesPropertiesContext =
                    // 		document.querySelector(".brx-body")?.__vue_app__?.config?.globalProperties;
                    // 	const VUE_APP = (document.querySelector(".brx-body") as any).__vue_app__;
                    // 	const selectColorMethod = VUE_APP._context.components["control-color"].methods.selectColor;
                    // 	const dataBoundFunction = VUE_APP._context.components["control-color"].data.bind(
                    // 		globalPropertiesPropertiesContext,
                    // 	);
                    // 	const controlColorData = dataBoundFunction();
                    // 	const colorPreviewTooltipBound = VUE_APP._context.components[
                    // 		"control-color"
                    // 	].computed.colorPreviewTooltip.bind(globalPropertiesPropertiesContext);
                    // 	if (selectColorMethod && globalPropertiesPropertiesContext) {
                    // 		const computed = Object.entries(VUE_APP._context.components["control-color"].computed).reduce<
                    // 			Record<string, [key: string, value: any]>
                    // 		>((acc, [key, _function]) => {
                    // 			const _boundFunction = (_function as any).bind({
                    // 				...this,
                    // 				...globalPropertiesPropertiesContext,
                    // 				selectColorMethod,
                    // 				...VUE_APP._context.components["control-color"],
                    // 				...VUE_APP._context.components["control-color"].methods,
                    // 				...VUE_APP._context.components["control-color"].computed,
                    // 				...{
                    // 					control: {
                    // 						palette: [...(VUE_APP.config?.globalProperties.$_state.colorPalette ?? [])],
                    // 					},
                    // 					colorPreviewTooltip: colorPreviewTooltipBound(),
                    // 					palettes: [...(VUE_APP.config?.globalProperties.$_state.colorPalette ?? [])],
                    // 					populateFromRaw: VUE_APP._context.components["control-color"].methods.populateFromRaw,
                    // 				},
                    // 				...controlColorData,
                    // 			});
                    // 			acc[key] = _boundFunction();
                    // 			return acc;
                    // 		}, {});
                    // 		console.log("🚀 ~ VariableUi ~ computed:", computed);
                    // 		const boundSelectColorMethod = selectColorMethod.bind({
                    // 			...globalPropertiesPropertiesContext,
                    // 			...VUE_APP._context.components["control-color"].methods,
                    // 			...VUE_APP._context.components["control-color"],
                    // 			...computed,
                    // 			...controlColorData,
                    // 			...{
                    // 				// polyfill vue $emit:
                    // 				$emit: (event: string, payload: any) => {
                    // 					const eventListener = new CustomEvent(event, payload);
                    // 					document.dispatchEvent(eventListener);
                    // 				},
                    // 				$nextTick: (func: () => void) => {
                    // 					setTimeout(func, 0);
                    // 					console.log("🚀 ~ VariableUi ~ func:", func);
                    // 				},
                    // 			},
                    // 			...this,
                    // 		});
                    // 		console.log("THIS ");
                    // 		console.log(this);
                    // 		boundSelectColorMethod({ raw: color, name: variable, id });
                    // 	} else {
                    // 		console.error("Method or context not found");
                    // 	}
                    // } catch (e) {
                    // 	console.warn(e);
                    // }
                    const recentColorPickerTargetCopy = this.recentColorPickerTarget;
                    this.selectColor({ name: variable });
                    this.recentVariableSelectionTimestamp = performance.now();
                    setTimeout(() => {
                        const activeElement = this.getActiveElement();
                        if (!activeElement) {
                            return;
                        }
                        const stylesArray = [
                            { property: "color", control: "typography" },
                            { property: "backgroundColor", control: "background" },
                            { property: "borderColor", control: "border" },
                        ];
                        for (const { property, control } of stylesArray) {
                            if (recentColorPickerTargetCopy === null || recentColorPickerTargetCopy === void 0 ? void 0 : recentColorPickerTargetCopy.closest(`[data-control="${control}"]`)) {
                                activeElement.style[property] = "";
                            }
                        }
                    }, 5);
                    return;
                }
                this.focusedInput.value = variableString;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
                this.tempInputValue = variableString;
                this.recentVariableSelectionTimestamp = performance.now();
                if (assertOption("bricks_enable_variable_ui_auto_hide")) {
                    this.close();
                }
            });
            button.addEventListener("mouseenter", () => {
                var _a;
                const timeElapsedBetweenSelections = performance.now() - this.recentVariableSelectionTimestamp;
                const isInCoolDown = timeElapsedBetweenSelections < this.HOVER_VARIABLE_PREVIEW_TIMEOUT;
                if (isInCoolDown) {
                    return;
                }
                if (!this.focusedInput) {
                    const activeElement = this.getActiveElement();
                    const variableString = variable.startsWith("var(--") ? variable : `var(--${variable})`;
                    if (!activeElement) {
                        return;
                    }
                    const stylesArray = [
                        { property: "color", control: "typography" },
                        { property: "backgroundColor", control: "background" },
                        { property: "borderColor", control: "border" },
                    ];
                    for (const { property, control } of stylesArray) {
                        if ((_a = this.recentColorPickerTarget) === null || _a === void 0 ? void 0 : _a.closest(`[data-control="${control}"]`)) {
                            activeElement.style[property] = variableString;
                        }
                    }
                    return;
                }
                const variableParsed = variable.startsWith("var(--") ? variable : `var(--${variable})`;
                this.focusedInput.value = variableParsed;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
            });
            button.addEventListener("mouseleave", () => {
                var _a, _b;
                if (!this.focusedInput || this.tempInputValue === null) {
                    const activeElement = this.getActiveElement();
                    if (!activeElement) {
                        return;
                    }
                    const stylesArray = [
                        { property: "color", control: "typography" },
                        { property: "backgroundColor", control: "background" },
                        { property: "borderColor", control: "border" },
                    ];
                    for (const { property, control } of stylesArray) {
                        if ((_a = this.recentColorPickerTarget) === null || _a === void 0 ? void 0 : _a.closest(`[data-control="${control}"]`)) {
                            activeElement.style[property] = "";
                        }
                    }
                    return;
                }
                this.focusedInput.value = this.tempInputValue;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
                const option = ((_b = this.focusedInput.previousElementSibling) === null || _b === void 0 ? void 0 : _b.classList.contains("oxygen-color-picker-color"))
                    ? "color"
                    : this.focusedInput.getAttribute("data-option");
                try {
                    window === null || window === void 0 ? void 0 : window.$scope.iframeScope.setOptionUnit(option, " ");
                }
                catch (_c) { }
            });
            return button;
        }
        createCategoryTitle(title) {
            const div = document.createElement("div");
            div.classList.add("cf-variable-ui-category-title");
            const b = document.createElement("b");
            b.textContent = title;
            div.appendChild(b);
            const toggleButton = document.createElement("button");
            toggleButton.classList.add("cf-variable-ui-section-toggle");
            div.appendChild(toggleButton);
            return div;
        }
        allowDrag(instance) {
            const draggable = instance.querySelector("#cf-variable-ui-header");
            if (!draggable) {
                return;
            }
            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;
            const handleDragStart = (e) => {
                [...document.querySelectorAll("iframe")].forEach((iframe) => {
                    iframe.style.pointerEvents = "none";
                    iframe.style.userSelect = "none";
                });
                isDragging = true;
                const rect = draggable.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                if (draggable) {
                    draggable.style.transition = "none";
                }
            };
            draggable.removeEventListener("mousedown", handleDragStart);
            draggable.addEventListener("mousedown", handleDragStart);
            const handleDrag = (e) => {
                if (!isDragging) {
                    return;
                }
                const rect = draggable.getBoundingClientRect();
                const clientX = e.clientX;
                const clientY = e.clientY;
                const x = clientX - offsetX;
                const y = clientY - offsetY;
                const posX = (x < 0 ? 0 : x > window.innerWidth - rect.width ? window.innerWidth - rect.width : x) + 10;
                const posY = y < 0 ? 0 : y > window.innerHeight - rect.height ? window.innerHeight - rect.height : y;
                instance.style.left = `${posX}px`;
                instance.style.top = `${posY}px`;
            };
            document.removeEventListener("mousemove", handleDrag);
            document.addEventListener("mousemove", handleDrag);
            const endDragging = (e) => {
                [...document.querySelectorAll("iframe")].forEach((iframe) => {
                    iframe.style.pointerEvents = "auto";
                    iframe.style.userSelect = "auto";
                });
                isDragging = false;
            };
            document.removeEventListener("mouseup", endDragging);
            document.addEventListener("mouseup", endDragging);
        }
        createExpandableWrapper({ title }) {
            const className = "cf-variable-ui-wrapper";
            const wrapper = document.createElement("div");
            wrapper.dataset.groupExpand = "false";
            wrapper.classList.add(className);
            const categoryTitle = this.createCategoryTitle(title);
            categoryTitle.addEventListener("click", () => {
                wrapper.dataset.groupExpand = wrapper.dataset.groupExpand === "true" ? "false" : "true";
            });
            wrapper.appendChild(categoryTitle);
            return wrapper;
        }
        createInstance() {
            var _a, _b;
            const main = document.createElement("cf-variable-ui");
            main.classList.add("cf-variable-ui");
            main.classList.add("is-bricks");
            main.style.position = "fixed";
            main.style.display = "none";
            main.style.width = "300px";
            main.style.height = "500px";
            main.style.zIndex = "99999999999";
            main.style.left = `${(window.innerWidth / 2 - 200).toString()}px`;
            main.style.top = `${(window.innerHeight / 2 - 300).toString()}px`;
            const header = document.createElement("div");
            header.id = "cf-variable-ui-header";
            header.style.width = "100%";
            const coreFrameworkLogo = document.createElement("img");
            coreFrameworkLogo.src = this.logoData;
            coreFrameworkLogo.classList.add("cf-variable-ui-logo");
            coreFrameworkLogo.style.setProperty("width", "30px");
            const openCoreFrameworkLink = document.createElement("a");
            openCoreFrameworkLink.href = `${new URL(window.location.href).origin}/wp-admin/admin.php?page=core-framework`;
            openCoreFrameworkLink.target = "_blank";
            openCoreFrameworkLink.textContent = "Open";
            openCoreFrameworkLink.dataset.cftooltip = "Open Core Framework plugin";
            openCoreFrameworkLink.classList.add("cf-variable-ui-open-core-framework");
            const closeButton = document.createElement("button");
            closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
            closeButton.classList.add("cf-variable-ui-close-button");
            closeButton.dataset.cftooltip = "Close";
            closeButton.addEventListener("click", () => this.close());
            header.appendChild(coreFrameworkLogo);
            header.appendChild(openCoreFrameworkLink);
            header.appendChild(closeButton);
            main.appendChild(header);
            const colorSystemGroups = (_b = (_a = this.colorSystemData) === null || _a === void 0 ? void 0 : _a.groups) !== null && _b !== void 0 ? _b : [];
            const colorSystemWrapper = this.createExpandableWrapper({
                title: "Color System",
            });
            colorSystemWrapper.dataset.type = "color-system";
            colorSystemGroups.forEach(({ colors, name, isDisabled }) => {
                if (isDisabled)
                    return;
                const container = document.createElement("div");
                container.classList.add("cf-variable-ui-color-wrapper");
                colors.forEach((color) => {
                    var _a, _b, _c, _d, _e, _f;
                    const main = this.createColorButton({
                        variable: color.name,
                        color: color.value,
                        darkColor: color.darkValue,
                        id: color.id,
                    });
                    const colorsWrapper = document.createElement("div");
                    const title = document.createElement("div");
                    title.classList.add("cf-variable-ui-color-title");
                    title.textContent = this.getPrefixedVariableName(color.name);
                    title.style.setProperty("font-weight", "bold");
                    colorsWrapper.classList.add("cf-variable-ui-color-wrapper-second");
                    colorsWrapper.appendChild(title);
                    colorsWrapper.appendChild(main);
                    const shades = (_b = (_a = color.shades) === null || _a === void 0 ? void 0 : _a.map((shade, index) => {
                        var _a, _b;
                        const darkColor = (_b = (_a = color.darkShades) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.value;
                        return this.createColorButton({
                            variable: shade.name,
                            color: shade.value,
                            id: `${color.id}.d.${index}`,
                            darkColor,
                        });
                    })) !== null && _b !== void 0 ? _b : [];
                    if (shades.length) {
                        const title = document.createElement("div");
                        title.classList.add("cf-variable-ui-color-title");
                        title.textContent = `Shades of ${this.getPrefixedVariableName(color.name)}`;
                        const shadesWrapper = document.createElement("div");
                        shadesWrapper.classList.add("cf-variable-ui-shades-wrapper");
                        shades.forEach((shade) => {
                            shadesWrapper.appendChild(shade);
                        });
                        colorsWrapper.appendChild(title);
                        colorsWrapper.appendChild(shadesWrapper);
                    }
                    const tints = (_d = (_c = color.tints) === null || _c === void 0 ? void 0 : _c.map((tint, index) => {
                        var _a, _b;
                        const darkColor = (_b = (_a = color.darkTints) === null || _a === void 0 ? void 0 : _a[index]) === null || _b === void 0 ? void 0 : _b.value;
                        return this.createColorButton({
                            variable: tint.name,
                            color: tint.value,
                            darkColor,
                            id: `${color.id}.l.${index}`,
                        });
                    })) !== null && _d !== void 0 ? _d : [];
                    if (tints.length) {
                        const title = document.createElement("div");
                        title.classList.add("cf-variable-ui-color-title");
                        title.textContent = `Tints of ${this.getPrefixedVariableName(color.name)}`;
                        const tintsWrapper = document.createElement("div");
                        tintsWrapper.classList.add("cf-variable-ui-tints-wrapper");
                        tints.forEach((tint) => {
                            tintsWrapper.appendChild(tint);
                        });
                        colorsWrapper.appendChild(title);
                        colorsWrapper.appendChild(tintsWrapper);
                    }
                    const transparent = (_f = (_e = color.transparentVariables) === null || _e === void 0 ? void 0 : _e.map((transparent) => {
                        return this.createColorButton({
                            variable: `${color.name}-${transparent}`,
                            color: color.value,
                            darkColor: color.darkValue,
                            transparent: Number(transparent),
                            id: `${color.id}.t.${color.name.split("-").slice(-1)[0]}`,
                        });
                    })) !== null && _f !== void 0 ? _f : [];
                    if (transparent.length) {
                        const title = document.createElement("div");
                        title.classList.add("cf-variable-ui-color-title");
                        title.textContent = `Transparent values of ${this.getPrefixedVariableName(color.name)}`;
                        const transparentWrapper = document.createElement("div");
                        transparentWrapper.classList.add("cf-variable-ui-transparent-wrapper");
                        transparent.forEach((transparent) => {
                            transparentWrapper.appendChild(transparent);
                        });
                        colorsWrapper.appendChild(title);
                        colorsWrapper.appendChild(transparentWrapper);
                    }
                    container.appendChild(colorsWrapper);
                });
                colorSystemWrapper.appendChild(container);
            });
            const scrollContainer = document.createElement("div");
            scrollContainer.classList.add("cf-variable-ui-scroll-container");
            scrollContainer.appendChild(colorSystemWrapper);
            Object.entries(this.variables).forEach(([title, variablesRecord]) => {
                var _a;
                const isEmpty = Object.keys(variablesRecord).length === 0;
                if (isEmpty) {
                    return;
                }
                const wrapper = this.createExpandableWrapper({
                    title: (_a = this.stylesGroupsLabelMap[title]) !== null && _a !== void 0 ? _a : title,
                });
                wrapper.dataset.type = title;
                Object.entries(variablesRecord).forEach(([category, variables]) => {
                    const getLabel = (variable) => {
                        if (category === "Fluid Typography" || category === "Fluid Spacing") {
                            const prefix = `${this.variablePrefix +
                                (category === "Fluid Typography"
                                    ? this.fluid_typography_naming_convention
                                    : this.fluid_spacing_naming_convention)}-`;
                            return variable.replace(prefix, "");
                        }
                        return variable;
                    };
                    const group = document.createElement("div");
                    const b = document.createElement("b");
                    b.textContent = category;
                    b.classList.add("cf-variable-ui-row-title");
                    group.appendChild(b);
                    group.classList.add("cf-variable-ui-group");
                    const container = document.createElement("div");
                    container.classList.add("cf-variable-ui-container");
                    variables.forEach((variable) => {
                        const button = this.createVarButton({
                            variable,
                            label: getLabel(variable),
                        });
                        container.appendChild(button);
                    });
                    group.appendChild(container);
                    wrapper.appendChild(group);
                });
                scrollContainer.appendChild(wrapper);
            });
            const symmetricGrids = new Array(12).fill(0).map((_, index) => {
                return {
                    variable: String(index + 1),
                    value: `repeat(${index + 1}, minmax(0, 1fr))`,
                };
            });
            const asymmetricGrids = [
                { variable: "1 / 2", value: "minmax(0, 1fr) minmax(0, 2fr)" },
                { variable: "2 / 1", value: "minmax(0, 2fr) minmax(0, 1fr)" },
                { variable: "1 / 3", value: "minmax(0, 1fr) minmax(0, 3fr)" },
                { variable: "3 / 1", value: "minmax(0, 3fr) minmax(0, 1fr)" },
                { variable: "2 / 3", value: "minmax(0, 2fr) minmax(0, 3fr)" },
                { variable: "3 / 2", value: "minmax(0, 3fr) minmax(0, 2fr)" },
                { variable: "1 / 4", value: "minmax(0, 1fr) minmax(0, 4fr)" },
                { variable: "4 / 1", value: "minmax(0, 4fr) minmax(0, 1fr)" },
                { variable: "3 / 4", value: "minmax(0, 3fr) minmax(0, 4fr)" },
                { variable: "4 / 3", value: "minmax(0, 4fr) minmax(0, 3fr)" },
            ];
            const gridWrapper = this.createExpandableWrapper({
                title: "Grid",
            });
            gridWrapper.dataset.type = "_gridVariables";
            [symmetricGrids, asymmetricGrids].forEach((grids, index) => {
                const group = document.createElement("div");
                const b = document.createElement("b");
                b.textContent = index === 0 ? "Symmetric Grids" : "Asymmetric Grids";
                b.classList.add("cf-variable-ui-row-title");
                group.appendChild(b);
                group.classList.add("cf-variable-ui-group");
                const container = document.createElement("div");
                container.classList.add("cf-variable-ui-container");
                grids.forEach((variable) => {
                    const button = this.createVarWithValueButton({
                        variable: variable.value,
                        value: variable.value,
                        label: variable.variable,
                    });
                    container.appendChild(button);
                });
                group.appendChild(container);
                gridWrapper.appendChild(group);
            });
            scrollContainer.appendChild(gridWrapper);
            main.appendChild(scrollContainer);
            document.body.appendChild(main);
            this.instance = main;
            this.allowDrag(main);
            setTimeout(() => {
                this.reposition();
            }, 100);
        }
        open() {
            if (!this.instance) {
                return;
            }
            this.instance.style.setProperty("display", "block");
            this.isOpen = true;
            const html = document.querySelector("html");
            if (!html) {
                return;
            }
            html.dataset.cfVariableUiOpen = "true";
        }
        close() {
            if (!this.instance) {
                return;
            }
            this.instance.style.setProperty("display", "none");
            this.tempInputValue = null;
            this.recentColorPickerTarget = null;
            this.isOpen = false;
            const html = document.querySelector("html");
            if (!html) {
                return;
            }
            html.dataset.cfVariableUiOpen = "false";
        }
        async getVariables() {
            window.coreframework = {
                nonce: window.wpApiSettings.nonce,
                rest_url: window.wpApiSettings.root,
                core_api_url: `${window.wpApiSettings.root}core-framework/v2/`,
            };
            const errorMessageCommon = "Please save changes again in the Core Framework plugin. Make sure Core Framework add-on is enabled and license is activated. If error persists, please contact support at https://coreframework.com/";
            try {
                const res = await fetch(`${window.coreframework.core_api_url}builders-var-ui`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": window.coreframework.nonce,
                    },
                });
                if (res.status !== 200) {
                    log(`Failed to load variables. ${errorMessageCommon}`);
                    return false;
                }
                const json = (await res.json());
                if (!(json === null || json === void 0 ? void 0 : json.variables)) {
                    log(`No variables found. ${errorMessageCommon}`);
                    return false;
                }
                this.variables = json.variables;
                if (!json.color_system_data) {
                    log(`No color system data found. ${errorMessageCommon}`);
                    return false;
                }
                this.colorSystemData = json.color_system_data;
                this.variablePrefix = json.variable_prefix;
                this.fluid_typography_naming_convention = json.fluid_typography_naming_convention;
                this.fluid_spacing_naming_convention = json.fluid_spacing_naming_convention;
                return true;
            }
            catch (e) {
                log(`Failed to load variables. ${errorMessageCommon}`);
                console.error(e);
                return false;
            }
        }
        reposition() {
            if (!this.instance) {
                return;
            }
            this.instance.style.top = `${(window.innerHeight / 2 - 300).toString()}px`;
            this.instance.style.left = `${(320).toString()}px`;
        }
        onInputClick(e) {
            var _a, _b, _c, _d, _e;
            const isContextMenu = e.type === "contextmenu" && assertOption("bricks_enable_variable_context_menu");
            if (isContextMenu) {
                e.preventDefault();
                e.stopPropagation();
            }
            if (!this.isOpen && !((e === null || e === void 0 ? void 0 : e.metaKey) || (e === null || e === void 0 ? void 0 : e.altKey)) && !isContextMenu) {
                return;
            }
            const input = e.target;
            if (!input) {
                return;
            }
            (_a = document === null || document === void 0 ? void 0 : document.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
            e.preventDefault();
            e.stopPropagation();
            this.focusedInput = input;
            this.tempInputValue = input.value;
            const control = input.closest("[data-controlkey]");
            const dataControlKey = (_c = (_b = control === null || control === void 0 ? void 0 : control.dataset.controlkey) === null || _b === void 0 ? void 0 : _b.toLocaleLowerCase()) !== null && _c !== void 0 ? _c : "";
            const isFontSize = ["typography", "font"].some((key) => dataControlKey === null || dataControlKey === void 0 ? void 0 : dataControlKey.includes(key));
            const isSpacing = ["padding", "margin", "gap", "width", "height"].some((key) => dataControlKey === null || dataControlKey === void 0 ? void 0 : dataControlKey.includes(key));
            const isDesign = ["_border"].includes(dataControlKey);
            const isColorInput = (_e = (_d = input.parentElement) === null || _d === void 0 ? void 0 : _d.parentElement) === null || _e === void 0 ? void 0 : _e.classList.contains("color-input");
            const isColsOrRows = ["_gridTemplateColumns", "_gridTemplateRows"].some((key) => dataControlKey === null || dataControlKey === void 0 ? void 0 : dataControlKey.includes(key.toLocaleLowerCase()));
            if (this.instance) {
                const colorWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='color-system']");
                const fontSizeWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='typographyStyles']");
                const spacingWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='spacingStyles']");
                const designWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='designStyles']");
                const gridWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='_gridVariables']");
                for (const wrapper of [colorWrapper, fontSizeWrapper, spacingWrapper, designWrapper, gridWrapper]) {
                    if (wrapper) {
                        wrapper.dataset.groupExpand = "false";
                        wrapper.dataset.hidden = "false";
                    }
                }
                if (colorWrapper) {
                    colorWrapper.dataset.hidden = isColorInput ? "false" : "true";
                    colorWrapper.dataset.groupExpand = isColorInput ? "true" : "false";
                }
                if (isFontSize && fontSizeWrapper)
                    fontSizeWrapper.dataset.groupExpand = "true";
                if (isSpacing && spacingWrapper)
                    spacingWrapper.dataset.groupExpand = "true";
                if (isColorInput && colorWrapper)
                    colorWrapper.dataset.groupExpand = "true";
                if (isDesign && designWrapper)
                    designWrapper.dataset.groupExpand = "true";
                if (isColsOrRows && gridWrapper)
                    gridWrapper.dataset.groupExpand = "true";
            }
            this.open();
        }
        onFocusCallback(e) {
            const input = e.target;
            this.focusedInput = input;
        }
        showBricksColorPopUp() {
            document.querySelectorAll(".cf-variable-ui-style").forEach((style) => {
                style.remove();
            });
        }
        hideBricksColorPopUp() {
            if (document.querySelector(".cf-variable-ui-style")) {
                return;
            }
            const css = `.bricks-control-popup { display: none !important; }`;
            const style = document.createElement("style");
            style.id = "cf-variable-ui-bricks-popup";
            style.appendChild(document.createTextNode(css));
            style.classList.add("cf-variable-ui-style");
            document.head.appendChild(style);
        }
        async selectColor({ name }) {
            var _a, _b, _c, _d;
            this.hideBricksColorPopUp();
            const isPopupAlreadyOpen = document.querySelector(".bricks-control-popup .color-palette.grid");
            if (!isPopupAlreadyOpen) {
                (_b = (_a = this.recentColorPickerTarget) === null || _a === void 0 ? void 0 : _a.closest(".bricks-control-preview")) === null || _b === void 0 ? void 0 : _b.click();
                await new Promise((resolve) => setTimeout(resolve, 25));
            }
            const colorsGrid = document.querySelector(".bricks-control-popup .color-palette.grid");
            if (colorsGrid) {
                const variableString = name.startsWith("var(--") ? name : `var(--${name})`;
                const targetColor = colorsGrid.querySelector(`[data-balloon="${variableString}"]`);
                (_c = targetColor === null || targetColor === void 0 ? void 0 : targetColor.parentElement) === null || _c === void 0 ? void 0 : _c.click();
            }
            else {
                log("Failed to select color. Color grid not found.");
            }
            (_d = document.querySelector("body")) === null || _d === void 0 ? void 0 : _d.click();
            await new Promise((resolve) => setTimeout(resolve, 2));
            if (document.querySelector(".bricks-control-popup")) {
                setTimeout(() => {
                    var _a;
                    (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.click();
                    setTimeout(() => {
                        this.showBricksColorPopUp();
                    }, 5);
                }, 5);
                log("Failed to close color picker. Delaying close.");
            }
            else {
                this.showBricksColorPopUp();
            }
        }
        handleColorVariableUiColorTriggerClick({ target }) {
            var _a;
            (_a = document === null || document === void 0 ? void 0 : document.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
            if (this.instance) {
                const colorWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='color-system']");
                const fontSizeWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='typographyStyles']");
                const spacingWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='spacingStyles']");
                const designWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='designStyles']");
                const gridWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='_gridVariables']");
                for (const wrapper of [colorWrapper, fontSizeWrapper, spacingWrapper, designWrapper, gridWrapper]) {
                    if (wrapper) {
                        wrapper.dataset.groupExpand = "false";
                        wrapper.dataset.hidden = "true";
                    }
                }
                if (colorWrapper) {
                    colorWrapper.dataset.groupExpand = "true";
                    colorWrapper.dataset.hidden = "false";
                }
            }
            this.recentColorPickerTarget = target;
            this.focusedInput = null;
            this.open();
        }
        addTriggers() {
            setTimeout(() => {
                bricksInputs.includedFields.forEach((field) => {
                    const wrappers = typeof field === "string"
                        ? [...document.querySelectorAll(field)]
                        : [...document.querySelectorAll(field.selector)].filter((n) => field.hasChild.some((c) => n.querySelector(c)));
                    wrappers.forEach((wrapper) => {
                        const input = wrapper.querySelector("input[type='text']");
                        if ((input === null || input === void 0 ? void 0 : input.getAttribute("cf-variable-ui")) === "true") {
                            return;
                        }
                        input === null || input === void 0 ? void 0 : input.removeEventListener("click", this.boundOnInputClick);
                        input === null || input === void 0 ? void 0 : input.addEventListener("click", this.boundOnInputClick);
                        input === null || input === void 0 ? void 0 : input.removeEventListener("focus", this.boundOnFocusCallback);
                        input === null || input === void 0 ? void 0 : input.addEventListener("focus", this.boundOnFocusCallback);
                        if (assertOption("bricks_enable_variable_context_menu")) {
                            input === null || input === void 0 ? void 0 : input.removeEventListener("contextmenu", this.boundOnInputClick);
                            input === null || input === void 0 ? void 0 : input.addEventListener("contextmenu", this.boundOnInputClick);
                        }
                        input === null || input === void 0 ? void 0 : input.setAttribute("cf-variable-ui", "true");
                    });
                });
                const popupTriggers = [...document.querySelectorAll(".bricks-control-preview")].filter((trigger) => {
                    var _a;
                    const closestControlInner = trigger.closest(".control-inner");
                    const labelFor = (_a = closestControlInner === null || closestControlInner === void 0 ? void 0 : closestControlInner.querySelector("label")) === null || _a === void 0 ? void 0 : _a.getAttribute("for");
                    return ["color", "fill", "stroke"].includes(labelFor !== null && labelFor !== void 0 ? labelFor : "");
                });
                popupTriggers.forEach((popupTrigger) => {
                    var _a;
                    const tooltipTrigger = popupTrigger.querySelector(".color-value-tooltip");
                    if (tooltipTrigger) {
                        const currentDataBallon = (_a = tooltipTrigger.getAttribute("data-balloon")) !== null && _a !== void 0 ? _a : "";
                        const newTooltip = currentDataBallon ? currentDataBallon : "Right click to open variable UI";
                        tooltipTrigger.setAttribute("data-balloon", newTooltip);
                    }
                    popupTrigger.addEventListener("contextmenu", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const target = e.target;
                        if (!target) {
                            return;
                        }
                        this.handleColorVariableUiColorTriggerClick({
                            target,
                        });
                    });
                    popupTrigger.addEventListener("click", (e) => {
                        const target = e.target;
                        const isContextMenu = e.type === "contextmenu" && assertOption("bricks_enable_variable_context_menu");
                        if (!isContextMenu || !target) {
                            return;
                        }
                        e.preventDefault();
                        e.stopPropagation();
                        this.handleColorVariableUiColorTriggerClick({
                            target,
                        });
                    });
                });
            }, 100);
        }
        addListeners() {
            const onKeyDown = (e) => {
                var _a;
                if (e.key === "Escape" && ((_a = this.instance) === null || _a === void 0 ? void 0 : _a.style.getPropertyValue("display")) === "block") {
                    this.close();
                }
            };
            document.addEventListener("keydown", onKeyDown);
            const onClick = (e) => {
                var _a, _b, _c, _d;
                if (this.isOpen &&
                    !((_a = this === null || this === void 0 ? void 0 : this.instance) === null || _a === void 0 ? void 0 : _a.contains(e.target)) &&
                    !((_b = e.target) === null || _b === void 0 ? void 0 : _b.classList.contains("cf-variable-ui-trigger")) &&
                    !((_d = (_c = e.target) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.classList.contains("cf-variable-ui-trigger"))) {
                    this.close();
                }
            };
            if (assertOption("bricks_enable_variable_ui_auto_hide")) {
                document.removeEventListener("click", onClick);
                document.addEventListener("click", onClick);
            }
        }
    }
    const main = () => {
        addThemeToggleButton();
        initApplyClassOnHover();
        initApplyVariableOnHover();
        // new VariableAutoComplete();
        new VariableUi();
    };
    document.addEventListener("DOMContentLoaded", main);
}
