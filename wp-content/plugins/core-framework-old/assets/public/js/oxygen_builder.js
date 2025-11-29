"use strict";
(() => {
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
    const throttle = (fn, wait = 300) => {
        let inThrottle;
        let lastFn;
        let lastTime;
        return function () {
            const args = arguments;
            if (!inThrottle) {
                fn.apply(this, args);
                lastTime = Date.now();
                inThrottle = true;
                return;
            }
            clearTimeout(lastFn);
            lastFn = setTimeout(() => {
                if (Date.now() - lastTime >= wait) {
                    fn.apply(this, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0));
        };
    };
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
    const excludedNgModels = [
        "iframeScope.component.options[iframeScope.component.active.id]['model']['background-image']",
        "iframeScope.component.options[iframeScope.component.active.id]['model']['icon-size']",
        "iframeScope.fontsFilter",
        "postsFilter",
        "currentlyEditingFilter",
        "iframeScope.iconFilter.title",
        "iframeScope.component.options[iframeScope.component.active.id]['model']['z-index']",
        "iframeScope.component.options[iframeScope.component.active.id]['model']['src']",
        "iframeScope.component.options[iframeScope.component.active.id]['model']['rel']",
        "iframeScope.component.options[iframeScope.component.active.id]['model']['url']",
        "iframeScope.component.options[iframeScope.component.active.id]['model']['testimonial_photo']",
        "iframeScope.component.options[iframeScope.component.active.id]['model']['pricing_box_price",
    ];
    const excludedNgModelsWithWildcard = [
        "iframeScope.component.options[iframeScope.component.active.id]['model']['title-*']",
        "iframeScope.component.options[iframeScope.component.active.id]['model']['icon-*']",
        "duration",
        "url",
        "speed",
        "time",
        "address",
        "zoom",
    ].map((s) => s.replace("*']", ""));
    const inputsSelector = `.oxygen-control input[type="text"]:not(.ct-iris-colorpicker):not([ng-model*="shortcode"])${excludedNgModels
        .map((s) => `:not([ng-model="${s}"])`)
        .join("")}${excludedNgModelsWithWildcard.map((s) => `:not([ng-model*="${s}"])`).join("")}`;
    const getCoreFrameworkConnector = () => { var _a; return (_a = window === null || window === void 0 ? void 0 : window.core_framework_connector) !== null && _a !== void 0 ? _a : DEFAULT_CORE_FRAMEWORK_CONNECTOR; };
    const assertOption = (feature) => { var _a, _b; return (_b = (_a = getCoreFrameworkConnector()) === null || _a === void 0 ? void 0 : _a[feature]) !== null && _b !== void 0 ? _b : false; };
    let ThemeClasses;
    (function (ThemeClasses) {
        ThemeClasses["DARK"] = "cf-theme-dark";
        ThemeClasses["LIGHT"] = "cf-theme-light";
    })(ThemeClasses || (ThemeClasses = {}));
    const log = (message, ...args) => console.log(`[Core Framework] ${message}`, ...args);
    const addThemeToggleButton = () => {
        var _a, _b;
        if (!assertOption("oxygen_enable_dark_mode_preview")) {
            return;
        }
        const themeMode = (_b = (_a = window === null || window === void 0 ? void 0 : window.core_framework_connector) === null || _a === void 0 ? void 0 : _a.theme_mode) !== null && _b !== void 0 ? _b : "light";
        const CT_IFRAME_ID = "ct-artificial-viewport";
        const leftPanel = document.querySelector(".oxygen-toolbar-panel");
        const toggleButton = document.createElement("div");
        const THEME_TOGGLE_BUTTON_CLASS = "cf-theme-toggle-button";
        if (!leftPanel) {
            log("Left panel not found");
            return;
        }
        toggleButton.classList.add("oxygen-toolbar-panel-toggle-button", "cf-theme-toggle-button-builder");
        const toggleButtonIconLight = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        toggleButtonIconLight.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        toggleButtonIconLight.setAttribute("stroke", "currentColor");
        toggleButtonIconLight.setAttribute("viewBox", "0 0 512 512");
        const toggleButtonIconLightPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        toggleButtonIconLightPath.setAttribute("d", "M375.7 19.7c-1.5-8-6.9-14.7-14.4-17.8s-16.1-2.2-22.8 2.4L256 61.1 173.5 4.2c-6.7-4.6-15.3-5.5-22.8-2.4s-12.9 9.8-14.4 17.8l-18.1 98.5L19.7 136.3c-8 1.5-14.7 6.9-17.8 14.4s-2.2 16.1 2.4 22.8L61.1 256 4.2 338.5c-4.6 6.7-5.5 15.3-2.4 22.8s9.8 13 17.8 14.4l98.5 18.1 18.1 98.5c1.5 8 6.9 14.7 14.4 17.8s16.1 2.2 22.8-2.4L256 450.9l82.5 56.9c6.7 4.6 15.3 5.5 22.8 2.4s12.9-9.8 14.4-17.8l18.1-98.5 98.5-18.1c8-1.5 14.7-6.9 17.8-14.4s2.2-16.1-2.4-22.8L450.9 256l56.9-82.5c4.6-6.7 5.5-15.3 2.4-22.8s-9.8-12.9-17.8-14.4l-98.5-18.1L375.7 19.7zM269.6 110l65.6-45.2 14.4 78.3c1.8 9.8 9.5 17.5 19.3 19.3l78.3 14.4L402 242.4c-5.7 8.2-5.7 19 0 27.2l45.2 65.6-78.3 14.4c-9.8 1.8-17.5 9.5-19.3 19.3l-14.4 78.3L269.6 402c-8.2-5.7-19-5.7-27.2 0l-65.6 45.2-14.4-78.3c-1.8-9.8-9.5-17.5-19.3-19.3L64.8 335.2 110 269.6c5.7-8.2 5.7-19 0-27.2L64.8 176.8l78.3-14.4c9.8-1.8 17.5-9.5 19.3-19.3l14.4-78.3L242.4 110c8.2 5.7 19 5.7 27.2 0zM256 368a112 112 0 1 0 0-224 112 112 0 1 0 0 224zM192 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z");
        toggleButtonIconLight.appendChild(toggleButtonIconLightPath);
        toggleButton.appendChild(toggleButtonIconLight);
        const toggleButtonIconDark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        toggleButtonIconDark.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        toggleButtonIconDark.setAttribute("viewBox", "0 0 512 512");
        const toggleButtonIconDarkPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        toggleButtonIconDarkPath.setAttribute("d", "M144.7 98.7c-21 34.1-33.1 74.3-33.1 117.3c0 98 62.8 181.4 150.4 211.7c-12.4 2.8-25.3 4.3-38.6 4.3C126.6 432 48 353.3 48 256c0-68.9 39.4-128.4 96.8-157.3zm62.1-66C91.1 41.2 0 137.9 0 256C0 379.7 100 480 223.5 480c47.8 0 92-15 128.4-40.6c1.9-1.3 3.7-2.7 5.5-4c4.8-3.6 9.4-7.4 13.9-11.4c2.7-2.4 5.3-4.8 7.9-7.3c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-3.7 .6-7.4 1.2-11.1 1.6c-5 .5-10.1 .9-15.3 1c-1.2 0-2.5 0-3.7 0c-.1 0-.2 0-.3 0c-96.8-.2-175.2-78.9-175.2-176c0-54.8 24.9-103.7 64.1-136c1-.9 2.1-1.7 3.2-2.6c4-3.2 8.2-6.2 12.5-9c3.1-2 6.3-4 9.6-5.8c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-3.6-.3-7.1-.5-10.7-.6c-2.7-.1-5.5-.1-8.2-.1c-3.3 0-6.5 .1-9.8 .2c-2.3 .1-4.6 .2-6.9 .4z");
        toggleButtonIconDark.appendChild(toggleButtonIconDarkPath);
        toggleButtonIconDark.style.display = "none";
        toggleButton.appendChild(toggleButtonIconDark);
        leftPanel.appendChild(toggleButton);
        const style = document.createElement("style");
        const css = `
			.cf-theme-toggle-button-builder {
				background-color: var(--oxy-dark);
				cursor: pointer;
				display: flex;
				position: relative;
				align-items: center;
				justify-content: center;
				border-radius: 50%;
				width: 30px;
				height: 30px;
				padding: 5px;
			}
			.cf-theme-toggle-button-builder path {
				fill: white;
				stroke: white;
			}
		`;
        style.appendChild(document.createTextNode(css));
        leftPanel.appendChild(style);
        const flipToggles = (state) => {
            var _a;
            const iframeDocument = (_a = document.getElementById(CT_IFRAME_ID)) === null || _a === void 0 ? void 0 : _a.contentDocument;
            if (!iframeDocument) {
                log("Iframe document not found");
                return;
            }
            [...iframeDocument.querySelectorAll(`.${THEME_TOGGLE_BUTTON_CLASS}`)].forEach((button) => {
                button.classList.add(state === "dark" ? ThemeClasses.DARK : ThemeClasses.LIGHT);
                button.classList.remove(state === "dark" ? ThemeClasses.LIGHT : ThemeClasses.DARK);
            });
        };
        const getSystemThemeClass = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? ThemeClasses.DARK
            : ThemeClasses.LIGHT;
        const iframe = document.getElementById(CT_IFRAME_ID);
        iframe === null || iframe === void 0 ? void 0 : iframe.addEventListener("load", () => setTimeout(() => {
            var _a, _b;
            const iframeHtml = (_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.querySelector("html");
            const html = document.querySelector("html");
            if (!iframeHtml) {
                log("Iframe html not found");
                return;
            }
            iframeHtml.classList.remove(...[ThemeClasses.DARK, ThemeClasses.LIGHT]);
            const savedTheme = (_b = window === null || window === void 0 ? void 0 : window.localStorage) === null || _b === void 0 ? void 0 : _b.getItem("cf-theme");
            const defaultTheme = String(themeMode === "auto" ? getSystemThemeClass : `cf-theme-${themeMode}`);
            iframeHtml.classList.add(savedTheme ? `cf-theme-${savedTheme}` : defaultTheme);
            html === null || html === void 0 ? void 0 : html.classList.add(savedTheme ? `cf-theme-${savedTheme}` : defaultTheme);
        }, 5));
        toggleButton.addEventListener("click", () => {
            var _a, _b;
            const iframeDocument = (_a = document.getElementById(CT_IFRAME_ID)) === null || _a === void 0 ? void 0 : _a.contentDocument;
            if (!iframeDocument) {
                log("Iframe document not found");
                return;
            }
            const iframeHtml = iframeDocument.querySelector("html");
            if (!iframeHtml) {
                log("Iframe html not found");
                return;
            }
            iframeHtml.classList.toggle(ThemeClasses.DARK);
            iframeHtml.classList.toggle(ThemeClasses.LIGHT);
            const html = document.querySelector("html");
            html === null || html === void 0 ? void 0 : html.classList.toggle(ThemeClasses.DARK);
            html === null || html === void 0 ? void 0 : html.classList.toggle(ThemeClasses.LIGHT);
            const toggleButtonIconLight = toggleButton.querySelector("svg:first-child");
            const toggleButtonIconDark = toggleButton.querySelector("svg:last-child");
            const isDark = iframeHtml.classList.contains(ThemeClasses.DARK);
            if (toggleButtonIconLight) {
                toggleButtonIconLight.style.display = isDark ? "block" : "none";
            }
            if (toggleButtonIconDark) {
                toggleButtonIconDark.style.display = isDark ? "none" : "block";
            }
            flipToggles(isDark ? "light" : "dark");
            (_b = window === null || window === void 0 ? void 0 : window.localStorage) === null || _b === void 0 ? void 0 : _b.setItem("cf-theme", isDark ? "dark" : "light");
        });
    };
    const modifyClass = (className, action) => {
        const iframeId = "ct-artificial-viewport";
        const iframe = document.getElementById(iframeId);
        const iframeDocument = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument;
        if (!iframeDocument) {
            log("Iframe document not found");
            return;
        }
        const activeClass = "ct-active";
        const activeElement = iframeDocument.querySelector(`.${activeClass}`);
        if (!activeElement) {
            log("Active element not found");
            return;
        }
        if (action === "add") {
            activeElement.classList.add(className);
        }
        else {
            activeElement.classList.remove(className);
        }
    };
    const applyColorPreview = (target, variable) => {
        const nearest = target === null || target === void 0 ? void 0 : target.closest(".oxygen-color-picker");
        const colorPicker = nearest === null || nearest === void 0 ? void 0 : nearest.querySelector(".button.wp-color-result");
        if (!colorPicker) {
            return;
        }
        colorPicker.style.backgroundColor = variable;
    };
    const applyClassOnHover = () => {
        if (!assertOption("oxygen_apply_class_on_hover")) {
            return;
        }
        const onClick = (value) => {
            setTimeout(() => {
                modifyClass(value, "add");
            }, 5);
        };
        const callback = () => {
            const suggestions = document.querySelectorAll(".oxygen-classes-dropdown .oxygen-classes-suggestions li");
            suggestions.forEach((suggestion) => {
                var _a;
                const secondChildTextContent = (_a = suggestion.children[1]) === null || _a === void 0 ? void 0 : _a.textContent;
                if (!secondChildTextContent) {
                    log("Second child text content not found");
                    return;
                }
                suggestion.removeEventListener("click", () => onClick(secondChildTextContent));
                suggestion.addEventListener("click", () => onClick(secondChildTextContent));
                suggestion.removeEventListener("mouseenter", () => modifyClass(secondChildTextContent, "add"));
                suggestion.addEventListener("mouseenter", () => modifyClass(secondChildTextContent, "add"));
                suggestion.removeEventListener("mouseleave", () => modifyClass(secondChildTextContent, "remove"));
                suggestion.addEventListener("mouseleave", () => modifyClass(secondChildTextContent, "remove"));
            });
        };
        const sideBarId = "oxygen-sidebar";
        observe({
            selector: `#${sideBarId}`,
            callback: throttle(callback, 100),
        });
    };
    class VariableAutoComplete {
        constructor() {
            this.variables = [];
            this.variablesGroups = {};
            this.colorVariables = [];
            this.init();
        }
        async init() {
            const isVariableDropdownEnabled = assertOption("oxygen_enable_variable_dropdown");
            if (!isVariableDropdownEnabled) {
                return;
            }
            const didLoadVariables = await this.getVariables();
            if (!didLoadVariables) {
                return;
            }
            const targets = [
                "#oxygen-sidebar-control-panel-basic-styles",
                ".oxygen-select",
                "#oxygen-sidebar",
                ".oxygen-sidebar-advanced-home",
            ];
            targets.forEach((target) => {
                observe({
                    selector: target,
                    callback: () => {
                        this.setVariableAutocomplete();
                    },
                    options: {
                        subtree: false,
                        childList: false,
                        attributes: true,
                    },
                });
            });
            observe({
                selector: ".oxygen-active-element-name",
                callback: () => {
                    this.setVariableAutocomplete();
                },
                options: {
                    subtree: true,
                    childList: true,
                    attributes: false,
                },
            });
            this.setVariableAutocomplete();
        }
        filterVariables(value) {
            return this.variables.filter((variable) => variable.toLocaleLowerCase().includes(value.toLocaleLowerCase()) && variable !== value);
        }
        sortVariables(input) {
            var _a;
            const SPACING_KEYS = ["padding", "margin", "gap", "width", "height"];
            const isSpacing = SPACING_KEYS.some((key) => String(input.dataset.option).includes(key));
            const isColorPicker = (_a = input.parentElement) === null || _a === void 0 ? void 0 : _a.classList.contains("oxygen-color-picker");
            const isFontSize = input.dataset.option === "font-size";
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
        emitInputEvent(input, value) {
            input.value = value;
            input.dispatchEvent(new Event("input"));
        }
        setUnitToNone(input) {
            var _a;
            try {
                const option = ((_a = input.previousElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains("oxygen-color-picker-color"))
                    ? "color"
                    : input.getAttribute("data-option");
                window === null || window === void 0 ? void 0 : window.$scope.iframeScope.setOptionUnit(option, " ");
            }
            catch (_b) { }
        }
        createDropdown({ options, target }) {
            var _a, _b, _c;
            document.querySelectorAll(".cf-variable-dropdown").forEach((dropdown) => {
                dropdown === null || dropdown === void 0 ? void 0 : dropdown.remove();
            });
            if (target === null || target === void 0 ? void 0 : target.parentElement) {
                target.parentElement.style.position = "relative";
            }
            const dropdown = document.createElement("div");
            const onMouseEnter = () => {
                if (assertOption("oxygen_enable_unit_and_value_preview")) {
                    this.setUnitToNone(target);
                }
            };
            dropdown.addEventListener("mouseenter", onMouseEnter);
            ["cf-variable-dropdown"].forEach((className) => dropdown.classList.add(className));
            const dropdownList = document.createElement("ul");
            const displayHint = assertOption("oxygen_enable_variable_ui_hint") && assertOption("oxygen_variable_ui");
            if (displayHint) {
                const hint = document.createElement("div");
                hint.classList.add("cf-variable-dropdown-hint");
                hint.classList.add("variable-dropdown-item");
                hint.textContent = `${((_a = navigator === null || navigator === void 0 ? void 0 : navigator.platform) === null || _a === void 0 ? void 0 : _a.toUpperCase().includes("MAC")) ? "⌘" : "Alt"} + Click to open variable UI`;
                hint.style.padding = "4px 10px";
                hint.style.color = "white";
                hint.style.opacity = "0.7";
                hint.style.fontSize = "12px";
                dropdown.appendChild(hint);
            }
            options.forEach((option) => {
                const listItem = document.createElement("li");
                listItem.textContent = option;
                listItem.setAttribute("tabindex", "0");
                listItem.setAttribute("role", "option");
                listItem.dataset.type = "variable-dropdown-item";
                listItem.dataset.value = option;
                let temp = "";
                setTimeout(() => {
                    listItem.addEventListener("mouseenter", (e) => {
                        if (assertOption("oxygen_enable_unit_and_value_preview")) {
                            temp = target.value;
                            this.emitInputEvent(target, option);
                        }
                    });
                    listItem.addEventListener("mouseleave", (e) => {
                        if (assertOption("oxygen_enable_unit_and_value_preview")) {
                            this.emitInputEvent(target, temp);
                            temp = "";
                        }
                    });
                }, 5);
                if (this.colorVariables.includes(option)) {
                    const span = document.createElement("span");
                    span.style.backgroundColor = option;
                    listItem.prepend(span);
                }
                dropdownList.appendChild(listItem);
            });
            dropdown.appendChild(dropdownList);
            (_b = target.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(dropdown);
            const dropdownItems = dropdown.querySelectorAll("li");
            (_c = target === null || target === void 0 ? void 0 : target.parentElement) === null || _c === void 0 ? void 0 : _c.querySelectorAll("li").forEach((item) => {
                item.addEventListener("mouseEnter", () => {
                    if (!assertOption("oxygen_enable_unit_and_value_preview")) {
                        return;
                    }
                    item.classList.add("selected");
                    target.value = item.dataset.value || temp;
                    target.dispatchEvent(new Event("input"));
                });
                item.addEventListener("mouseLeave", () => {
                    if (!assertOption("oxygen_enable_unit_and_value_preview")) {
                        return;
                    }
                    item.classList.remove("selected");
                    target.value = temp;
                    target.dispatchEvent(new Event("input"));
                });
            });
            const temp = target.value;
            let activeIndex = -1;
            const setActiveIndex = (index) => {
                activeIndex = index;
                dropdownItems.forEach((item, i) => {
                    if (i === activeIndex) {
                        item.classList.add("selected");
                        return;
                    }
                    item.classList.remove("selected");
                });
            };
            target.addEventListener("keydown", (e) => {
                switch (e.key) {
                    case "Escape": {
                        const item = dropdownItems[activeIndex];
                        if (!item) {
                            return;
                        }
                        this.emitInputEvent(target, temp || "");
                        target.focus();
                        break;
                    }
                    case "ArrowDown": {
                        e.preventDefault();
                        if (activeIndex === -1) {
                            setActiveIndex(0);
                            return;
                        }
                        if (activeIndex === dropdownItems.length - 1) {
                            return;
                        }
                        setActiveIndex(activeIndex + 1);
                        const activeItem = dropdownItems[activeIndex];
                        if (!activeItem) {
                            return;
                        }
                        dropdown.scrollTop = activeItem.offsetTop - dropdown.clientHeight + activeItem.clientHeight;
                        const item = dropdownItems[activeIndex];
                        if (!item) {
                            return;
                        }
                        const value = item.dataset.value;
                        if (!value) {
                            return;
                        }
                        this.setUnitToNone(target);
                        this.emitInputEvent(target, value);
                        target.focus();
                        break;
                    }
                    case "ArrowUp": {
                        e.preventDefault();
                        if (activeIndex === -1) {
                            setActiveIndex(dropdownItems.length - 1);
                            return;
                        }
                        if (activeIndex === 0) {
                            return;
                        }
                        setActiveIndex(activeIndex - 1);
                        const activeItem = dropdownItems[activeIndex];
                        if (!activeItem) {
                            return;
                        }
                        dropdown.scrollTop = activeItem.offsetTop - dropdown.clientHeight + activeItem.clientHeight;
                        const item = dropdownItems[activeIndex];
                        if (!item) {
                            return;
                        }
                        const value = item.dataset.value;
                        if (!value) {
                            return;
                        }
                        this.setUnitToNone(target);
                        this.emitInputEvent(target, value);
                        target.focus();
                        break;
                    }
                    case "Enter": {
                        e.preventDefault();
                        if (activeIndex === -1) {
                            return;
                        }
                        const item = dropdownItems[activeIndex];
                        if (!item) {
                            return;
                        }
                        const value = item.dataset.value;
                        if (!value) {
                            return;
                        }
                        this.emitInputEvent(target, value);
                        target.focus();
                        document.querySelectorAll(".cf-variable-dropdown").forEach((dropdown) => {
                            dropdown === null || dropdown === void 0 ? void 0 : dropdown.remove();
                        });
                        this.setUnitToNone(target);
                        applyColorPreview(target, value);
                        break;
                    }
                }
            });
        }
        onClick(e) {
            if (!e.isTrusted) {
                return;
            }
            if ((e === null || e === void 0 ? void 0 : e.metaKey) || (e === null || e === void 0 ? void 0 : e.altKey)) {
                return;
            }
            const target = e.target;
            this.sortVariables(target);
            const options = this.filterVariables(target.value);
            if (!options.length) {
                return;
            }
            this.createDropdown({
                options,
                target,
            });
        }
        onType(e) {
            if (!e.isTrusted) {
                return;
            }
            if ((e === null || e === void 0 ? void 0 : e.metaKey) || (e === null || e === void 0 ? void 0 : e.altKey)) {
                return;
            }
            const target = e.target;
            const value = target.value;
            const options = this.filterVariables(value);
            if (!options.length) {
                return;
            }
            this.createDropdown({
                options,
                target,
            });
        }
        onInputBlur(e) {
            var _a;
            document.querySelectorAll(".cf-variable-dropdown").forEach((dropdown) => {
                dropdown === null || dropdown === void 0 ? void 0 : dropdown.remove();
            });
            const inputs = document.querySelectorAll(`.oxygen-control input[type="text"]`);
            inputs.forEach((input) => {
                // @ts-ignore
                input.removeEventListener("click", this.onInputFocus);
                input.removeEventListener("blur", this.onInputBlur);
            });
            const relatedItem = e.relatedTarget;
            if (!relatedItem) {
                return;
            }
            const isDropdownItem = relatedItem.dataset.type === "variable-dropdown-item";
            if (!isDropdownItem) {
                return;
            }
            const value = relatedItem.dataset.value;
            const input = e === null || e === void 0 ? void 0 : e.target;
            if (!input || !value) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            input.value = value;
            input.dispatchEvent(new Event("input"));
            input.focus();
            const option = ((_a = input.previousElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains("oxygen-color-picker-color"))
                ? "color"
                : input.getAttribute("data-option");
            try {
                window === null || window === void 0 ? void 0 : window.$scope.iframeScope.setOptionUnit(option, " ");
            }
            catch (_b) { }
            applyColorPreview(input, value);
        }
        setVariableAutocomplete() {
            const previousDropdowns = document.querySelectorAll(".cf-variable-dropdown");
            previousDropdowns.forEach((dropdown) => {
                dropdown === null || dropdown === void 0 ? void 0 : dropdown.remove();
            });
            const inputs = document.querySelectorAll(inputsSelector);
            inputs.forEach((input) => {
                input.removeEventListener("click", this.onClick.bind(this));
                input.removeEventListener("focusout", this.onInputBlur.bind(this));
                input.removeEventListener("input", this.onType.bind(this));
                input.addEventListener("click", this.onClick.bind(this));
                input.addEventListener("focusout", this.onInputBlur.bind(this));
                input.addEventListener("input", this.onType.bind(this));
            });
        }
        async getVariables() {
            var _a;
            window.coreframework = {
                nonce: window.wpApiSettings.nonce,
                rest_url: window.wpApiSettings.root,
                core_api_url: `${window.wpApiSettings.root}core-framework/v2/`,
            };
            try {
                const res = await fetch(`${window.coreframework.core_api_url}get-variables?type=oxygen_dropdown`, {
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
            this.boundOnClickCallback = this.onClickCallback.bind(this);
        }
        async init() {
            if (!assertOption("oxygen_variable_ui")) {
                return;
            }
            const didLoadVariables = await this.getVariables();
            if (!didLoadVariables) {
                return;
            }
            const targets = [
                "#oxygen-sidebar-control-panel-basic-styles",
                ".oxygen-select",
                "#oxygen-sidebar",
                ".oxygen-sidebar-advanced-home",
            ];
            targets.forEach((target) => {
                observe({
                    selector: target,
                    callback: () => {
                        this.addTriggers();
                    },
                    options: {
                        subtree: false,
                        childList: false,
                        attributes: true,
                    },
                });
            });
            observe({
                selector: ".oxygen-active-element-name",
                callback: () => {
                    this.addTriggers();
                },
                options: {
                    subtree: true,
                    childList: true,
                    attributes: false,
                },
            });
            this.createInstance();
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
                var _a;
                if (!this.focusedInput) {
                    return;
                }
                const variableParsed = variable.startsWith("var(--") ? variable : `var(--${variable})`;
                this.focusedInput.value = variableParsed;
                this.tempInputValue = variableParsed;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
                const option = ((_a = this.focusedInput.previousElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains("oxygen-color-picker-color"))
                    ? "color"
                    : this.focusedInput.getAttribute("data-option");
                try {
                    window === null || window === void 0 ? void 0 : window.$scope.iframeScope.setOptionUnit(option, " ");
                }
                catch (_b) { }
                applyColorPreview(this.focusedInput, variableParsed);
                if (assertOption("oxygen_enable_variable_ui_auto_hide")) {
                    this.close();
                }
            });
            button.addEventListener("mouseenter", () => {
                var _a;
                if (!this.focusedInput || !assertOption("oxygen_enable_unit_and_value_preview")) {
                    return;
                }
                const variableParsed = variable.startsWith("var(--") ? variable : `var(--${variable})`;
                this.focusedInput.value = variableParsed;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
                const option = ((_a = this.focusedInput.previousElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains("oxygen-color-picker-color"))
                    ? "color"
                    : this.focusedInput.getAttribute("data-option");
                try {
                    window === null || window === void 0 ? void 0 : window.$scope.iframeScope.setOptionUnit(option, " ");
                }
                catch (_b) { }
                applyColorPreview(this.focusedInput, variableParsed);
            });
            button.addEventListener("mouseleave", () => {
                var _a;
                if (!this.focusedInput ||
                    this.tempInputValue === null ||
                    !assertOption("oxygen_enable_unit_and_value_preview")) {
                    return;
                }
                this.focusedInput.value = this.tempInputValue;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
                const option = ((_a = this.focusedInput.previousElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains("oxygen-color-picker-color"))
                    ? "color"
                    : this.focusedInput.getAttribute("data-option");
                try {
                    window === null || window === void 0 ? void 0 : window.$scope.iframeScope.setOptionUnit(option, " ");
                }
                catch (_b) { }
                applyColorPreview(this.focusedInput, this.tempInputValue);
            });
            return button;
        }
        getPrefixedVariableName(variable) {
            return variable.startsWith(this.variablePrefix) ? variable : `${this.variablePrefix}${variable}`;
        }
        createColorButton({ variable, color, darkColor, transparent, }) {
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
            button.addEventListener("click", () => {
                var _a;
                if (!this.focusedInput) {
                    return;
                }
                const variableParsed = variable.startsWith("var(--") ? variable : `var(--${variable})`;
                this.focusedInput.value = variableParsed;
                this.tempInputValue = variableParsed;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
                const option = ((_a = this.focusedInput.previousElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains("oxygen-color-picker-color"))
                    ? "color"
                    : this.focusedInput.getAttribute("data-option");
                try {
                    window === null || window === void 0 ? void 0 : window.$scope.iframeScope.setOptionUnit(option, " ");
                }
                catch (_b) { }
                applyColorPreview(this.focusedInput, variableParsed);
                if (assertOption("oxygen_enable_variable_ui_auto_hide")) {
                    this.close();
                }
            });
            button.addEventListener("mouseenter", () => {
                var _a;
                if (!this.focusedInput || !assertOption("oxygen_enable_unit_and_value_preview")) {
                    return;
                }
                const variableParsed = variable.startsWith("var(--") ? variable : `var(--${variable})`;
                this.focusedInput.value = variableParsed;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
                const option = ((_a = this.focusedInput.previousElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains("oxygen-color-picker-color"))
                    ? "color"
                    : this.focusedInput.getAttribute("data-option");
                try {
                    window === null || window === void 0 ? void 0 : window.$scope.iframeScope.setOptionUnit(option, " ");
                }
                catch (_b) { }
                applyColorPreview(this.focusedInput, variableParsed);
            });
            button.addEventListener("mouseleave", () => {
                var _a;
                if (!this.focusedInput ||
                    this.tempInputValue === null ||
                    !assertOption("oxygen_enable_unit_and_value_preview")) {
                    return;
                }
                this.focusedInput.value = this.tempInputValue;
                this.focusedInput.dispatchEvent(new Event("input"));
                this.focusedInput.focus();
                const option = ((_a = this.focusedInput.previousElementSibling) === null || _a === void 0 ? void 0 : _a.classList.contains("oxygen-color-picker-color"))
                    ? "color"
                    : this.focusedInput.getAttribute("data-option");
                try {
                    window === null || window === void 0 ? void 0 : window.$scope.iframeScope.setOptionUnit(option, " ");
                }
                catch (_b) { }
                applyColorPreview(this.focusedInput, this.tempInputValue);
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
            document.addEventListener("mousemove", handleDrag);
            const endDragging = (e) => {
                [...document.querySelectorAll("iframe")].forEach((iframe) => {
                    iframe.style.pointerEvents = "auto";
                    iframe.style.userSelect = "auto";
                });
                isDragging = false;
            };
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
            main.classList.add("is-oxygen");
            main.style.position = "fixed";
            main.style.display = "none";
            main.style.width = "300px";
            main.style.height = "500px";
            main.style.zIndex = "1000";
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
            openCoreFrameworkLink.classList.add("cf-variable-ui-open-core-framework");
            openCoreFrameworkLink.textContent = "Open";
            openCoreFrameworkLink.dataset.cftooltip = "Open Core Framework plugin";
            const closeButton = document.createElement("button");
            closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;
            closeButton.classList.add("cf-variable-ui-close-button");
            closeButton.dataset.cftooltip = "Close";
            closeButton.addEventListener("click", this.close.bind(this));
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
                            const prefix = this.variablePrefix +
                                (category === "Fluid Typography"
                                    ? this.fluid_typography_naming_convention
                                    : this.fluid_spacing_naming_convention) +
                                "-";
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
            this.isOpen = false;
            this.tempInputValue = null;
            const html = document.querySelector("html");
            if (!html) {
                return;
            }
            html.dataset.cfVariableUiOpen = "false";
            [...document.querySelectorAll("iframe")].forEach((iframe) => {
                iframe.style.pointerEvents = "auto";
                iframe.style.userSelect = "auto";
            });
        }
        async getVariables() {
            window.coreframework = {
                nonce: window.wpApiSettings.nonce,
                rest_url: window.wpApiSettings.root,
                core_api_url: `${window.wpApiSettings.root}core-framework/v2/`,
            };
            try {
                const res = await fetch(`${window.coreframework.core_api_url}builders-var-ui`, {
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
                this.variables = json.variables;
                if (!json.color_system_data) {
                    log("No color system data found. Please save changes again in the Core Framework plugin.");
                    return false;
                }
                this.colorSystemData = json.color_system_data;
                this.variablePrefix = json.variable_prefix;
                this.fluid_typography_naming_convention = json.fluid_typography_naming_convention;
                this.fluid_spacing_naming_convention = json.fluid_spacing_naming_convention;
                return true;
            }
            catch (e) {
                log("Failed to load variables.");
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
        onClickCallback(e) {
            var _a;
            const isContextMenu = e.type === "contextmenu" && assertOption("oxygen_enable_variable_context_menu");
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
            e.preventDefault();
            e.stopPropagation();
            this.focusedInput = input;
            this.tempInputValue = input.value;
            const isColorDropdown = (_a = input.parentElement) === null || _a === void 0 ? void 0 : _a.classList.contains("oxygen-color-picker");
            const isFontSize = input.dataset.option === "font-size";
            const SPACING_KEYS = ["padding", "margin", "gap", "width", "height"];
            const isSpacing = SPACING_KEYS.some((key) => String(input.dataset.option).includes(key));
            if (this.instance) {
                this.instance.dataset.enableColors = isColorDropdown ? "true" : "false";
                const colorWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='color-system']");
                const fontSizeWrapper = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='typographyStyles']");
                const target = this.instance.querySelector(".cf-variable-ui-wrapper[data-type='spacingStyles']");
                for (const wrapper of [colorWrapper, fontSizeWrapper, target]) {
                    if (!wrapper) {
                        return;
                    }
                    wrapper.dataset.groupExpand = "false";
                }
                if (isColorDropdown && colorWrapper)
                    colorWrapper.dataset.groupExpand = "true";
                if (isFontSize && fontSizeWrapper)
                    fontSizeWrapper.dataset.groupExpand = "true";
                if (isSpacing && target)
                    target.dataset.groupExpand = "true";
            }
            this.open();
            document.querySelectorAll(".cf-variable-dropdown").forEach((dropdown) => dropdown === null || dropdown === void 0 ? void 0 : dropdown.remove());
        }
        addTriggers() {
            document.querySelectorAll(".cf-variable-ui-trigger").forEach((trigger) => {
                trigger === null || trigger === void 0 ? void 0 : trigger.remove();
            });
            document.querySelectorAll(inputsSelector).forEach((input) => {
                input.removeEventListener("click", this.boundOnClickCallback);
                input.addEventListener("click", this.boundOnClickCallback);
                if (assertOption("oxygen_enable_variable_context_menu")) {
                    input === null || input === void 0 ? void 0 : input.removeEventListener("contextmenu", this.boundOnClickCallback);
                    input === null || input === void 0 ? void 0 : input.addEventListener("contextmenu", this.boundOnClickCallback);
                }
            });
            const onKeyDowListener = (e) => {
                var _a;
                if (e.key === "Escape" && ((_a = this.instance) === null || _a === void 0 ? void 0 : _a.style.getPropertyValue("display")) === "block") {
                    this.close();
                }
            };
            document.removeEventListener("keydown", onKeyDowListener);
            document.addEventListener("keydown", onKeyDowListener);
            const onClick = (e) => {
                var _a, _b, _c, _d;
                if (this.isOpen &&
                    !((_a = this === null || this === void 0 ? void 0 : this.instance) === null || _a === void 0 ? void 0 : _a.contains(e.target)) &&
                    !((_b = e.target) === null || _b === void 0 ? void 0 : _b.classList.contains("cf-variable-ui-trigger")) &&
                    !((_d = (_c = e.target) === null || _c === void 0 ? void 0 : _c.parentElement) === null || _d === void 0 ? void 0 : _d.classList.contains("cf-variable-ui-trigger"))) {
                    this.close();
                }
            };
            if (assertOption("oxygen_enable_variable_ui_auto_hide")) {
                document.removeEventListener("click", onClick);
                document.addEventListener("click", onClick);
            }
        }
    }
    const main = () => {
        addThemeToggleButton();
        applyClassOnHover();
        new VariableAutoComplete();
        new VariableUi();
    };
    document.addEventListener("DOMContentLoaded", main);
})();
