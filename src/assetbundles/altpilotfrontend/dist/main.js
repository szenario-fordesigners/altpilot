(function() {
	//#region \0rolldown/runtime.js
	var __defProp = Object.defineProperty;
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	//#endregion
	//#region node_modules/.pnpm/@vue+shared@3.5.32/node_modules/@vue/shared/dist/shared.esm-bundler.js
	/**
	* @vue/shared v3.5.32
	* (c) 2018-present Yuxi (Evan) You and Vue contributors
	* @license MIT
	**/
	/* @__NO_SIDE_EFFECTS__ */
	function makeMap(str) {
		const map = /* @__PURE__ */ Object.create(null);
		for (const key of str.split(",")) map[key] = 1;
		return (val) => val in map;
	}
	var EMPTY_OBJ = {};
	var EMPTY_ARR = [];
	var NOOP = () => {};
	var NO = () => false;
	var isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
	var isModelListener = (key) => key.startsWith("onUpdate:");
	var extend = Object.assign;
	var remove = (arr, el) => {
		const i = arr.indexOf(el);
		if (i > -1) arr.splice(i, 1);
	};
	var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
	var hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
	var isArray = Array.isArray;
	var isMap = (val) => toTypeString(val) === "[object Map]";
	var isSet = (val) => toTypeString(val) === "[object Set]";
	var isDate = (val) => toTypeString(val) === "[object Date]";
	var isRegExp = (val) => toTypeString(val) === "[object RegExp]";
	var isFunction = (val) => typeof val === "function";
	var isString = (val) => typeof val === "string";
	var isSymbol = (val) => typeof val === "symbol";
	var isObject$1 = (val) => val !== null && typeof val === "object";
	var isPromise = (val) => {
		return (isObject$1(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
	};
	var objectToString = Object.prototype.toString;
	var toTypeString = (value) => objectToString.call(value);
	var toRawType = (value) => {
		return toTypeString(value).slice(8, -1);
	};
	var isPlainObject$2 = (val) => toTypeString(val) === "[object Object]";
	var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
	var isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
	var cacheStringFunction$1 = (fn) => {
		const cache = /* @__PURE__ */ Object.create(null);
		return ((str) => {
			return cache[str] || (cache[str] = fn(str));
		});
	};
	var camelizeRE$1 = /-\w/g;
	var camelize$1 = cacheStringFunction$1((str) => {
		return str.replace(camelizeRE$1, (c) => c.slice(1).toUpperCase());
	});
	var hyphenateRE$1 = /\B([A-Z])/g;
	var hyphenate$1 = cacheStringFunction$1((str) => str.replace(hyphenateRE$1, "-$1").toLowerCase());
	var capitalize = cacheStringFunction$1((str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	});
	var toHandlerKey = cacheStringFunction$1((str) => {
		return str ? `on${capitalize(str)}` : ``;
	});
	var hasChanged = (value, oldValue) => !Object.is(value, oldValue);
	var invokeArrayFns = (fns, ...arg) => {
		for (let i = 0; i < fns.length; i++) fns[i](...arg);
	};
	var def = (obj, key, value, writable = false) => {
		Object.defineProperty(obj, key, {
			configurable: true,
			enumerable: false,
			writable,
			value
		});
	};
	var looseToNumber = (val) => {
		const n = parseFloat(val);
		return isNaN(n) ? val : n;
	};
	var toNumber = (val) => {
		const n = isString(val) ? Number(val) : NaN;
		return isNaN(n) ? val : n;
	};
	var _globalThis;
	var getGlobalThis = () => {
		return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
	};
	var isGloballyAllowed = /* @__PURE__ */ makeMap("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console,Error,Symbol");
	function normalizeStyle(value) {
		if (isArray(value)) {
			const res = {};
			for (let i = 0; i < value.length; i++) {
				const item = value[i];
				const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
				if (normalized) for (const key in normalized) res[key] = normalized[key];
			}
			return res;
		} else if (isString(value) || isObject$1(value)) return value;
	}
	var listDelimiterRE = /;(?![^(]*\))/g;
	var propertyDelimiterRE = /:([^]+)/;
	var styleCommentRE = /\/\*[^]*?\*\//g;
	function parseStringStyle(cssText) {
		const ret = {};
		cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
			if (item) {
				const tmp = item.split(propertyDelimiterRE);
				tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
			}
		});
		return ret;
	}
	function normalizeClass(value) {
		let res = "";
		if (isString(value)) res = value;
		else if (isArray(value)) for (let i = 0; i < value.length; i++) {
			const normalized = normalizeClass(value[i]);
			if (normalized) res += normalized + " ";
		}
		else if (isObject$1(value)) {
			for (const name in value) if (value[name]) res += name + " ";
		}
		return res.trim();
	}
	function normalizeProps(props) {
		if (!props) return null;
		let { class: klass, style } = props;
		if (klass && !isString(klass)) props.class = normalizeClass(klass);
		if (style) props.style = normalizeStyle(style);
		return props;
	}
	var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
	var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
	specialBooleanAttrs + "";
	function includeBooleanAttr(value) {
		return !!value || value === "";
	}
	function looseCompareArrays(a, b) {
		if (a.length !== b.length) return false;
		let equal = true;
		for (let i = 0; equal && i < a.length; i++) equal = looseEqual(a[i], b[i]);
		return equal;
	}
	function looseEqual(a, b) {
		if (a === b) return true;
		let aValidType = isDate(a);
		let bValidType = isDate(b);
		if (aValidType || bValidType) return aValidType && bValidType ? a.getTime() === b.getTime() : false;
		aValidType = isSymbol(a);
		bValidType = isSymbol(b);
		if (aValidType || bValidType) return a === b;
		aValidType = isArray(a);
		bValidType = isArray(b);
		if (aValidType || bValidType) return aValidType && bValidType ? looseCompareArrays(a, b) : false;
		aValidType = isObject$1(a);
		bValidType = isObject$1(b);
		if (aValidType || bValidType) {
			if (!aValidType || !bValidType) return false;
			if (Object.keys(a).length !== Object.keys(b).length) return false;
			for (const key in a) {
				const aHasKey = a.hasOwnProperty(key);
				const bHasKey = b.hasOwnProperty(key);
				if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) return false;
			}
		}
		return String(a) === String(b);
	}
	function looseIndexOf(arr, val) {
		return arr.findIndex((item) => looseEqual(item, val));
	}
	var isRef$1 = (val) => {
		return !!(val && val["__v_isRef"] === true);
	};
	var toDisplayString = (val) => {
		return isString(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
	};
	var replacer = (_key, val) => {
		if (isRef$1(val)) return replacer(_key, val.value);
		else if (isMap(val)) return { [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2], i) => {
			entries[stringifySymbol(key, i) + " =>"] = val2;
			return entries;
		}, {}) };
		else if (isSet(val)) return { [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v)) };
		else if (isSymbol(val)) return stringifySymbol(val);
		else if (isObject$1(val) && !isArray(val) && !isPlainObject$2(val)) return String(val);
		return val;
	};
	var stringifySymbol = (v, i = "") => {
		var _a;
		return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
	};
	function normalizeCssVarValue(value) {
		if (value == null) return "initial";
		if (typeof value === "string") return value === "" ? " " : value;
		if (typeof value !== "number" || !Number.isFinite(value)) {}
		return String(value);
	}
	//#endregion
	//#region node_modules/.pnpm/@vue+reactivity@3.5.32/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
	/**
	* @vue/reactivity v3.5.32
	* (c) 2018-present Yuxi (Evan) You and Vue contributors
	* @license MIT
	**/
	var activeEffectScope;
	var EffectScope = class {
		constructor(detached = false) {
			this.detached = detached;
			/**
			* @internal
			*/
			this._active = true;
			/**
			* @internal track `on` calls, allow `on` call multiple times
			*/
			this._on = 0;
			/**
			* @internal
			*/
			this.effects = [];
			/**
			* @internal
			*/
			this.cleanups = [];
			this._isPaused = false;
			this.__v_skip = true;
			this.parent = activeEffectScope;
			if (!detached && activeEffectScope) this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
		}
		get active() {
			return this._active;
		}
		pause() {
			if (this._active) {
				this._isPaused = true;
				let i, l;
				if (this.scopes) for (i = 0, l = this.scopes.length; i < l; i++) this.scopes[i].pause();
				for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].pause();
			}
		}
		/**
		* Resumes the effect scope, including all child scopes and effects.
		*/
		resume() {
			if (this._active) {
				if (this._isPaused) {
					this._isPaused = false;
					let i, l;
					if (this.scopes) for (i = 0, l = this.scopes.length; i < l; i++) this.scopes[i].resume();
					for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].resume();
				}
			}
		}
		run(fn) {
			if (this._active) {
				const currentEffectScope = activeEffectScope;
				try {
					activeEffectScope = this;
					return fn();
				} finally {
					activeEffectScope = currentEffectScope;
				}
			}
		}
		/**
		* This should only be called on non-detached scopes
		* @internal
		*/
		on() {
			if (++this._on === 1) {
				this.prevScope = activeEffectScope;
				activeEffectScope = this;
			}
		}
		/**
		* This should only be called on non-detached scopes
		* @internal
		*/
		off() {
			if (this._on > 0 && --this._on === 0) {
				activeEffectScope = this.prevScope;
				this.prevScope = void 0;
			}
		}
		stop(fromParent) {
			if (this._active) {
				this._active = false;
				let i, l;
				for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].stop();
				this.effects.length = 0;
				for (i = 0, l = this.cleanups.length; i < l; i++) this.cleanups[i]();
				this.cleanups.length = 0;
				if (this.scopes) {
					for (i = 0, l = this.scopes.length; i < l; i++) this.scopes[i].stop(true);
					this.scopes.length = 0;
				}
				if (!this.detached && this.parent && !fromParent) {
					const last = this.parent.scopes.pop();
					if (last && last !== this) {
						this.parent.scopes[this.index] = last;
						last.index = this.index;
					}
				}
				this.parent = void 0;
			}
		}
	};
	function effectScope(detached) {
		return new EffectScope(detached);
	}
	function getCurrentScope() {
		return activeEffectScope;
	}
	function onScopeDispose(fn, failSilently = false) {
		if (activeEffectScope) activeEffectScope.cleanups.push(fn);
	}
	var activeSub;
	var pausedQueueEffects = /* @__PURE__ */ new WeakSet();
	var ReactiveEffect = class {
		constructor(fn) {
			this.fn = fn;
			/**
			* @internal
			*/
			this.deps = void 0;
			/**
			* @internal
			*/
			this.depsTail = void 0;
			/**
			* @internal
			*/
			this.flags = 5;
			/**
			* @internal
			*/
			this.next = void 0;
			/**
			* @internal
			*/
			this.cleanup = void 0;
			this.scheduler = void 0;
			if (activeEffectScope && activeEffectScope.active) activeEffectScope.effects.push(this);
		}
		pause() {
			this.flags |= 64;
		}
		resume() {
			if (this.flags & 64) {
				this.flags &= -65;
				if (pausedQueueEffects.has(this)) {
					pausedQueueEffects.delete(this);
					this.trigger();
				}
			}
		}
		/**
		* @internal
		*/
		notify() {
			if (this.flags & 2 && !(this.flags & 32)) return;
			if (!(this.flags & 8)) batch(this);
		}
		run() {
			if (!(this.flags & 1)) return this.fn();
			this.flags |= 2;
			cleanupEffect(this);
			prepareDeps(this);
			const prevEffect = activeSub;
			const prevShouldTrack = shouldTrack;
			activeSub = this;
			shouldTrack = true;
			try {
				return this.fn();
			} finally {
				cleanupDeps(this);
				activeSub = prevEffect;
				shouldTrack = prevShouldTrack;
				this.flags &= -3;
			}
		}
		stop() {
			if (this.flags & 1) {
				for (let link = this.deps; link; link = link.nextDep) removeSub(link);
				this.deps = this.depsTail = void 0;
				cleanupEffect(this);
				this.onStop && this.onStop();
				this.flags &= -2;
			}
		}
		trigger() {
			if (this.flags & 64) pausedQueueEffects.add(this);
			else if (this.scheduler) this.scheduler();
			else this.runIfDirty();
		}
		/**
		* @internal
		*/
		runIfDirty() {
			if (isDirty(this)) this.run();
		}
		get dirty() {
			return isDirty(this);
		}
	};
	var batchDepth = 0;
	var batchedSub;
	var batchedComputed;
	function batch(sub, isComputed = false) {
		sub.flags |= 8;
		if (isComputed) {
			sub.next = batchedComputed;
			batchedComputed = sub;
			return;
		}
		sub.next = batchedSub;
		batchedSub = sub;
	}
	function startBatch() {
		batchDepth++;
	}
	function endBatch() {
		if (--batchDepth > 0) return;
		if (batchedComputed) {
			let e = batchedComputed;
			batchedComputed = void 0;
			while (e) {
				const next = e.next;
				e.next = void 0;
				e.flags &= -9;
				e = next;
			}
		}
		let error;
		while (batchedSub) {
			let e = batchedSub;
			batchedSub = void 0;
			while (e) {
				const next = e.next;
				e.next = void 0;
				e.flags &= -9;
				if (e.flags & 1) try {
					e.trigger();
				} catch (err) {
					if (!error) error = err;
				}
				e = next;
			}
		}
		if (error) throw error;
	}
	function prepareDeps(sub) {
		for (let link = sub.deps; link; link = link.nextDep) {
			link.version = -1;
			link.prevActiveLink = link.dep.activeLink;
			link.dep.activeLink = link;
		}
	}
	function cleanupDeps(sub) {
		let head;
		let tail = sub.depsTail;
		let link = tail;
		while (link) {
			const prev = link.prevDep;
			if (link.version === -1) {
				if (link === tail) tail = prev;
				removeSub(link);
				removeDep(link);
			} else head = link;
			link.dep.activeLink = link.prevActiveLink;
			link.prevActiveLink = void 0;
			link = prev;
		}
		sub.deps = head;
		sub.depsTail = tail;
	}
	function isDirty(sub) {
		for (let link = sub.deps; link; link = link.nextDep) if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) return true;
		if (sub._dirty) return true;
		return false;
	}
	function refreshComputed(computed) {
		if (computed.flags & 4 && !(computed.flags & 16)) return;
		computed.flags &= -17;
		if (computed.globalVersion === globalVersion) return;
		computed.globalVersion = globalVersion;
		if (!computed.isSSR && computed.flags & 128 && (!computed.deps && !computed._dirty || !isDirty(computed))) return;
		computed.flags |= 2;
		const dep = computed.dep;
		const prevSub = activeSub;
		const prevShouldTrack = shouldTrack;
		activeSub = computed;
		shouldTrack = true;
		try {
			prepareDeps(computed);
			const value = computed.fn(computed._value);
			if (dep.version === 0 || hasChanged(value, computed._value)) {
				computed.flags |= 128;
				computed._value = value;
				dep.version++;
			}
		} catch (err) {
			dep.version++;
			throw err;
		} finally {
			activeSub = prevSub;
			shouldTrack = prevShouldTrack;
			cleanupDeps(computed);
			computed.flags &= -3;
		}
	}
	function removeSub(link, soft = false) {
		const { dep, prevSub, nextSub } = link;
		if (prevSub) {
			prevSub.nextSub = nextSub;
			link.prevSub = void 0;
		}
		if (nextSub) {
			nextSub.prevSub = prevSub;
			link.nextSub = void 0;
		}
		if (dep.subs === link) {
			dep.subs = prevSub;
			if (!prevSub && dep.computed) {
				dep.computed.flags &= -5;
				for (let l = dep.computed.deps; l; l = l.nextDep) removeSub(l, true);
			}
		}
		if (!soft && !--dep.sc && dep.map) dep.map.delete(dep.key);
	}
	function removeDep(link) {
		const { prevDep, nextDep } = link;
		if (prevDep) {
			prevDep.nextDep = nextDep;
			link.prevDep = void 0;
		}
		if (nextDep) {
			nextDep.prevDep = prevDep;
			link.nextDep = void 0;
		}
	}
	function effect(fn, options) {
		if (fn.effect instanceof ReactiveEffect) fn = fn.effect.fn;
		const e = new ReactiveEffect(fn);
		if (options) extend(e, options);
		try {
			e.run();
		} catch (err) {
			e.stop();
			throw err;
		}
		const runner = e.run.bind(e);
		runner.effect = e;
		return runner;
	}
	function stop(runner) {
		runner.effect.stop();
	}
	var shouldTrack = true;
	var trackStack = [];
	function pauseTracking() {
		trackStack.push(shouldTrack);
		shouldTrack = false;
	}
	function resetTracking() {
		const last = trackStack.pop();
		shouldTrack = last === void 0 ? true : last;
	}
	function cleanupEffect(e) {
		const { cleanup } = e;
		e.cleanup = void 0;
		if (cleanup) {
			const prevSub = activeSub;
			activeSub = void 0;
			try {
				cleanup();
			} finally {
				activeSub = prevSub;
			}
		}
	}
	var globalVersion = 0;
	var Link = class {
		constructor(sub, dep) {
			this.sub = sub;
			this.dep = dep;
			this.version = dep.version;
			this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
		}
	};
	var Dep = class {
		constructor(computed) {
			this.computed = computed;
			this.version = 0;
			/**
			* Link between this dep and the current active effect
			*/
			this.activeLink = void 0;
			/**
			* Doubly linked list representing the subscribing effects (tail)
			*/
			this.subs = void 0;
			/**
			* For object property deps cleanup
			*/
			this.map = void 0;
			this.key = void 0;
			/**
			* Subscriber counter
			*/
			this.sc = 0;
			/**
			* @internal
			*/
			this.__v_skip = true;
		}
		track(debugInfo) {
			if (!activeSub || !shouldTrack || activeSub === this.computed) return;
			let link = this.activeLink;
			if (link === void 0 || link.sub !== activeSub) {
				link = this.activeLink = new Link(activeSub, this);
				if (!activeSub.deps) activeSub.deps = activeSub.depsTail = link;
				else {
					link.prevDep = activeSub.depsTail;
					activeSub.depsTail.nextDep = link;
					activeSub.depsTail = link;
				}
				addSub(link);
			} else if (link.version === -1) {
				link.version = this.version;
				if (link.nextDep) {
					const next = link.nextDep;
					next.prevDep = link.prevDep;
					if (link.prevDep) link.prevDep.nextDep = next;
					link.prevDep = activeSub.depsTail;
					link.nextDep = void 0;
					activeSub.depsTail.nextDep = link;
					activeSub.depsTail = link;
					if (activeSub.deps === link) activeSub.deps = next;
				}
			}
			return link;
		}
		trigger(debugInfo) {
			this.version++;
			globalVersion++;
			this.notify(debugInfo);
		}
		notify(debugInfo) {
			startBatch();
			try {
				for (let link = this.subs; link; link = link.prevSub) if (link.sub.notify()) link.sub.dep.notify();
			} finally {
				endBatch();
			}
		}
	};
	function addSub(link) {
		link.dep.sc++;
		if (link.sub.flags & 4) {
			const computed = link.dep.computed;
			if (computed && !link.dep.subs) {
				computed.flags |= 20;
				for (let l = computed.deps; l; l = l.nextDep) addSub(l);
			}
			const currentTail = link.dep.subs;
			if (currentTail !== link) {
				link.prevSub = currentTail;
				if (currentTail) currentTail.nextSub = link;
			}
			link.dep.subs = link;
		}
	}
	var targetMap = /* @__PURE__ */ new WeakMap();
	var ITERATE_KEY = /* @__PURE__ */ Symbol("");
	var MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
	var ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
	function track(target, type, key) {
		if (shouldTrack && activeSub) {
			let depsMap = targetMap.get(target);
			if (!depsMap) targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
			let dep = depsMap.get(key);
			if (!dep) {
				depsMap.set(key, dep = new Dep());
				dep.map = depsMap;
				dep.key = key;
			}
			dep.track();
		}
	}
	function trigger(target, type, key, newValue, oldValue, oldTarget) {
		const depsMap = targetMap.get(target);
		if (!depsMap) {
			globalVersion++;
			return;
		}
		const run = (dep) => {
			if (dep) dep.trigger();
		};
		startBatch();
		if (type === "clear") depsMap.forEach(run);
		else {
			const targetIsArray = isArray(target);
			const isArrayIndex = targetIsArray && isIntegerKey(key);
			if (targetIsArray && key === "length") {
				const newLength = Number(newValue);
				depsMap.forEach((dep, key2) => {
					if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) run(dep);
				});
			} else {
				if (key !== void 0 || depsMap.has(void 0)) run(depsMap.get(key));
				if (isArrayIndex) run(depsMap.get(ARRAY_ITERATE_KEY));
				switch (type) {
					case "add":
						if (!targetIsArray) {
							run(depsMap.get(ITERATE_KEY));
							if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
						} else if (isArrayIndex) run(depsMap.get("length"));
						break;
					case "delete":
						if (!targetIsArray) {
							run(depsMap.get(ITERATE_KEY));
							if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
						}
						break;
					case "set":
						if (isMap(target)) run(depsMap.get(ITERATE_KEY));
						break;
				}
			}
		}
		endBatch();
	}
	function getDepFromReactive(object, key) {
		const depMap = targetMap.get(object);
		return depMap && depMap.get(key);
	}
	function reactiveReadArray(array) {
		const raw = /* @__PURE__ */ toRaw(array);
		if (raw === array) return raw;
		track(raw, "iterate", ARRAY_ITERATE_KEY);
		return /* @__PURE__ */ isShallow(array) ? raw : raw.map(toReactive);
	}
	function shallowReadArray(arr) {
		track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
		return arr;
	}
	function toWrapped(target, item) {
		if (/* @__PURE__ */ isReadonly(target)) return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
		return toReactive(item);
	}
	var arrayInstrumentations = {
		__proto__: null,
		[Symbol.iterator]() {
			return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
		},
		concat(...args) {
			return reactiveReadArray(this).concat(...args.map((x) => isArray(x) ? reactiveReadArray(x) : x));
		},
		entries() {
			return iterator(this, "entries", (value) => {
				value[1] = toWrapped(this, value[1]);
				return value;
			});
		},
		every(fn, thisArg) {
			return apply(this, "every", fn, thisArg, void 0, arguments);
		},
		filter(fn, thisArg) {
			return apply(this, "filter", fn, thisArg, (v) => v.map((item) => toWrapped(this, item)), arguments);
		},
		find(fn, thisArg) {
			return apply(this, "find", fn, thisArg, (item) => toWrapped(this, item), arguments);
		},
		findIndex(fn, thisArg) {
			return apply(this, "findIndex", fn, thisArg, void 0, arguments);
		},
		findLast(fn, thisArg) {
			return apply(this, "findLast", fn, thisArg, (item) => toWrapped(this, item), arguments);
		},
		findLastIndex(fn, thisArg) {
			return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
		},
		forEach(fn, thisArg) {
			return apply(this, "forEach", fn, thisArg, void 0, arguments);
		},
		includes(...args) {
			return searchProxy(this, "includes", args);
		},
		indexOf(...args) {
			return searchProxy(this, "indexOf", args);
		},
		join(separator) {
			return reactiveReadArray(this).join(separator);
		},
		lastIndexOf(...args) {
			return searchProxy(this, "lastIndexOf", args);
		},
		map(fn, thisArg) {
			return apply(this, "map", fn, thisArg, void 0, arguments);
		},
		pop() {
			return noTracking(this, "pop");
		},
		push(...args) {
			return noTracking(this, "push", args);
		},
		reduce(fn, ...args) {
			return reduce(this, "reduce", fn, args);
		},
		reduceRight(fn, ...args) {
			return reduce(this, "reduceRight", fn, args);
		},
		shift() {
			return noTracking(this, "shift");
		},
		some(fn, thisArg) {
			return apply(this, "some", fn, thisArg, void 0, arguments);
		},
		splice(...args) {
			return noTracking(this, "splice", args);
		},
		toReversed() {
			return reactiveReadArray(this).toReversed();
		},
		toSorted(comparer) {
			return reactiveReadArray(this).toSorted(comparer);
		},
		toSpliced(...args) {
			return reactiveReadArray(this).toSpliced(...args);
		},
		unshift(...args) {
			return noTracking(this, "unshift", args);
		},
		values() {
			return iterator(this, "values", (item) => toWrapped(this, item));
		}
	};
	function iterator(self, method, wrapValue) {
		const arr = shallowReadArray(self);
		const iter = arr[method]();
		if (arr !== self && !/* @__PURE__ */ isShallow(self)) {
			iter._next = iter.next;
			iter.next = () => {
				const result = iter._next();
				if (!result.done) result.value = wrapValue(result.value);
				return result;
			};
		}
		return iter;
	}
	var arrayProto = Array.prototype;
	function apply(self, method, fn, thisArg, wrappedRetFn, args) {
		const arr = shallowReadArray(self);
		const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
		const methodFn = arr[method];
		if (methodFn !== arrayProto[method]) {
			const result2 = methodFn.apply(self, args);
			return needsWrap ? toReactive(result2) : result2;
		}
		let wrappedFn = fn;
		if (arr !== self) {
			if (needsWrap) wrappedFn = function(item, index) {
				return fn.call(this, toWrapped(self, item), index, self);
			};
			else if (fn.length > 2) wrappedFn = function(item, index) {
				return fn.call(this, item, index, self);
			};
		}
		const result = methodFn.call(arr, wrappedFn, thisArg);
		return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
	}
	function reduce(self, method, fn, args) {
		const arr = shallowReadArray(self);
		const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
		let wrappedFn = fn;
		let wrapInitialAccumulator = false;
		if (arr !== self) {
			if (needsWrap) {
				wrapInitialAccumulator = args.length === 0;
				wrappedFn = function(acc, item, index) {
					if (wrapInitialAccumulator) {
						wrapInitialAccumulator = false;
						acc = toWrapped(self, acc);
					}
					return fn.call(this, acc, toWrapped(self, item), index, self);
				};
			} else if (fn.length > 3) wrappedFn = function(acc, item, index) {
				return fn.call(this, acc, item, index, self);
			};
		}
		const result = arr[method](wrappedFn, ...args);
		return wrapInitialAccumulator ? toWrapped(self, result) : result;
	}
	function searchProxy(self, method, args) {
		const arr = /* @__PURE__ */ toRaw(self);
		track(arr, "iterate", ARRAY_ITERATE_KEY);
		const res = arr[method](...args);
		if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
			args[0] = /* @__PURE__ */ toRaw(args[0]);
			return arr[method](...args);
		}
		return res;
	}
	function noTracking(self, method, args = []) {
		pauseTracking();
		startBatch();
		const res = (/* @__PURE__ */ toRaw(self))[method].apply(self, args);
		endBatch();
		resetTracking();
		return res;
	}
	var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
	var builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
	function hasOwnProperty(key) {
		if (!isSymbol(key)) key = String(key);
		const obj = /* @__PURE__ */ toRaw(this);
		track(obj, "has", key);
		return obj.hasOwnProperty(key);
	}
	var BaseReactiveHandler = class {
		constructor(_isReadonly = false, _isShallow = false) {
			this._isReadonly = _isReadonly;
			this._isShallow = _isShallow;
		}
		get(target, key, receiver) {
			if (key === "__v_skip") return target["__v_skip"];
			const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
			if (key === "__v_isReactive") return !isReadonly2;
			else if (key === "__v_isReadonly") return isReadonly2;
			else if (key === "__v_isShallow") return isShallow2;
			else if (key === "__v_raw") {
				if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) return target;
				return;
			}
			const targetIsArray = isArray(target);
			if (!isReadonly2) {
				let fn;
				if (targetIsArray && (fn = arrayInstrumentations[key])) return fn;
				if (key === "hasOwnProperty") return hasOwnProperty;
			}
			const res = Reflect.get(target, key, /* @__PURE__ */ isRef(target) ? target : receiver);
			if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) return res;
			if (!isReadonly2) track(target, "get", key);
			if (isShallow2) return res;
			if (/* @__PURE__ */ isRef(res)) {
				const value = targetIsArray && isIntegerKey(key) ? res : res.value;
				return isReadonly2 && isObject$1(value) ? /* @__PURE__ */ readonly(value) : value;
			}
			if (isObject$1(res)) return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
			return res;
		}
	};
	var MutableReactiveHandler = class extends BaseReactiveHandler {
		constructor(isShallow2 = false) {
			super(false, isShallow2);
		}
		set(target, key, value, receiver) {
			let oldValue = target[key];
			const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
			if (!this._isShallow) {
				const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
				if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
					oldValue = /* @__PURE__ */ toRaw(oldValue);
					value = /* @__PURE__ */ toRaw(value);
				}
				if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) if (isOldValueReadonly) return true;
				else {
					oldValue.value = value;
					return true;
				}
			}
			const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
			const result = Reflect.set(target, key, value, /* @__PURE__ */ isRef(target) ? target : receiver);
			if (target === /* @__PURE__ */ toRaw(receiver)) {
				if (!hadKey) trigger(target, "add", key, value);
				else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
			}
			return result;
		}
		deleteProperty(target, key) {
			const hadKey = hasOwn(target, key);
			const oldValue = target[key];
			const result = Reflect.deleteProperty(target, key);
			if (result && hadKey) trigger(target, "delete", key, void 0, oldValue);
			return result;
		}
		has(target, key) {
			const result = Reflect.has(target, key);
			if (!isSymbol(key) || !builtInSymbols.has(key)) track(target, "has", key);
			return result;
		}
		ownKeys(target) {
			track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
			return Reflect.ownKeys(target);
		}
	};
	var ReadonlyReactiveHandler = class extends BaseReactiveHandler {
		constructor(isShallow2 = false) {
			super(true, isShallow2);
		}
		set(target, key) {
			return true;
		}
		deleteProperty(target, key) {
			return true;
		}
	};
	var mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
	var readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
	var shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
	var shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
	var toShallow = (value) => value;
	var getProto = (v) => Reflect.getPrototypeOf(v);
	function createIterableMethod(method, isReadonly2, isShallow2) {
		return function(...args) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const targetIsMap = isMap(rawTarget);
			const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
			const isKeyOnly = method === "keys" && targetIsMap;
			const innerIterator = target[method](...args);
			const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
			!isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
			return extend(Object.create(innerIterator), { next() {
				const { value, done } = innerIterator.next();
				return done ? {
					value,
					done
				} : {
					value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
					done
				};
			} });
		};
	}
	function createReadonlyMethod(type) {
		return function(...args) {
			return type === "delete" ? false : type === "clear" ? void 0 : this;
		};
	}
	function createInstrumentations(readonly, shallow) {
		const instrumentations = {
			get(key) {
				const target = this["__v_raw"];
				const rawTarget = /* @__PURE__ */ toRaw(target);
				const rawKey = /* @__PURE__ */ toRaw(key);
				if (!readonly) {
					if (hasChanged(key, rawKey)) track(rawTarget, "get", key);
					track(rawTarget, "get", rawKey);
				}
				const { has } = getProto(rawTarget);
				const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
				if (has.call(rawTarget, key)) return wrap(target.get(key));
				else if (has.call(rawTarget, rawKey)) return wrap(target.get(rawKey));
				else if (target !== rawTarget) target.get(key);
			},
			get size() {
				const target = this["__v_raw"];
				!readonly && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
				return target.size;
			},
			has(key) {
				const target = this["__v_raw"];
				const rawTarget = /* @__PURE__ */ toRaw(target);
				const rawKey = /* @__PURE__ */ toRaw(key);
				if (!readonly) {
					if (hasChanged(key, rawKey)) track(rawTarget, "has", key);
					track(rawTarget, "has", rawKey);
				}
				return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
			},
			forEach(callback, thisArg) {
				const observed = this;
				const target = observed["__v_raw"];
				const rawTarget = /* @__PURE__ */ toRaw(target);
				const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
				!readonly && track(rawTarget, "iterate", ITERATE_KEY);
				return target.forEach((value, key) => {
					return callback.call(thisArg, wrap(value), wrap(key), observed);
				});
			}
		};
		extend(instrumentations, readonly ? {
			add: createReadonlyMethod("add"),
			set: createReadonlyMethod("set"),
			delete: createReadonlyMethod("delete"),
			clear: createReadonlyMethod("clear")
		} : {
			add(value) {
				const target = /* @__PURE__ */ toRaw(this);
				const proto = getProto(target);
				const rawValue = /* @__PURE__ */ toRaw(value);
				const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
				if (!(proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue))) {
					target.add(valueToAdd);
					trigger(target, "add", valueToAdd, valueToAdd);
				}
				return this;
			},
			set(key, value) {
				if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) value = /* @__PURE__ */ toRaw(value);
				const target = /* @__PURE__ */ toRaw(this);
				const { has, get } = getProto(target);
				let hadKey = has.call(target, key);
				if (!hadKey) {
					key = /* @__PURE__ */ toRaw(key);
					hadKey = has.call(target, key);
				}
				const oldValue = get.call(target, key);
				target.set(key, value);
				if (!hadKey) trigger(target, "add", key, value);
				else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
				return this;
			},
			delete(key) {
				const target = /* @__PURE__ */ toRaw(this);
				const { has, get } = getProto(target);
				let hadKey = has.call(target, key);
				if (!hadKey) {
					key = /* @__PURE__ */ toRaw(key);
					hadKey = has.call(target, key);
				}
				const oldValue = get ? get.call(target, key) : void 0;
				const result = target.delete(key);
				if (hadKey) trigger(target, "delete", key, void 0, oldValue);
				return result;
			},
			clear() {
				const target = /* @__PURE__ */ toRaw(this);
				const hadItems = target.size !== 0;
				const oldTarget = void 0;
				const result = target.clear();
				if (hadItems) trigger(target, "clear", void 0, void 0, oldTarget);
				return result;
			}
		});
		[
			"keys",
			"values",
			"entries",
			Symbol.iterator
		].forEach((method) => {
			instrumentations[method] = createIterableMethod(method, readonly, shallow);
		});
		return instrumentations;
	}
	function createInstrumentationGetter(isReadonly2, shallow) {
		const instrumentations = createInstrumentations(isReadonly2, shallow);
		return (target, key, receiver) => {
			if (key === "__v_isReactive") return !isReadonly2;
			else if (key === "__v_isReadonly") return isReadonly2;
			else if (key === "__v_raw") return target;
			return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
		};
	}
	var mutableCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, false) };
	var shallowCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, true) };
	var readonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, false) };
	var shallowReadonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, true) };
	var reactiveMap = /* @__PURE__ */ new WeakMap();
	var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
	var readonlyMap = /* @__PURE__ */ new WeakMap();
	var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
	function targetTypeMap(rawType) {
		switch (rawType) {
			case "Object":
			case "Array": return 1;
			case "Map":
			case "Set":
			case "WeakMap":
			case "WeakSet": return 2;
			default: return 0;
		}
	}
	function getTargetType(value) {
		return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
	}
	/* @__NO_SIDE_EFFECTS__ */
	function reactive(target) {
		if (/* @__PURE__ */ isReadonly(target)) return target;
		return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
	}
	/* @__NO_SIDE_EFFECTS__ */
	function shallowReactive(target) {
		return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
	}
	/* @__NO_SIDE_EFFECTS__ */
	function readonly(target) {
		return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
	}
	/* @__NO_SIDE_EFFECTS__ */
	function shallowReadonly(target) {
		return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
	}
	function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
		if (!isObject$1(target)) return target;
		if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) return target;
		const targetType = getTargetType(target);
		if (targetType === 0) return target;
		const existingProxy = proxyMap.get(target);
		if (existingProxy) return existingProxy;
		const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
		proxyMap.set(target, proxy);
		return proxy;
	}
	/* @__NO_SIDE_EFFECTS__ */
	function isReactive(value) {
		if (/* @__PURE__ */ isReadonly(value)) return /* @__PURE__ */ isReactive(value["__v_raw"]);
		return !!(value && value["__v_isReactive"]);
	}
	/* @__NO_SIDE_EFFECTS__ */
	function isReadonly(value) {
		return !!(value && value["__v_isReadonly"]);
	}
	/* @__NO_SIDE_EFFECTS__ */
	function isShallow(value) {
		return !!(value && value["__v_isShallow"]);
	}
	/* @__NO_SIDE_EFFECTS__ */
	function isProxy(value) {
		return value ? !!value["__v_raw"] : false;
	}
	/* @__NO_SIDE_EFFECTS__ */
	function toRaw(observed) {
		const raw = observed && observed["__v_raw"];
		return raw ? /* @__PURE__ */ toRaw(raw) : observed;
	}
	function markRaw(value) {
		if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) def(value, "__v_skip", true);
		return value;
	}
	var toReactive = (value) => isObject$1(value) ? /* @__PURE__ */ reactive(value) : value;
	var toReadonly = (value) => isObject$1(value) ? /* @__PURE__ */ readonly(value) : value;
	/* @__NO_SIDE_EFFECTS__ */
	function isRef(r) {
		return r ? r["__v_isRef"] === true : false;
	}
	/* @__NO_SIDE_EFFECTS__ */
	function ref(value) {
		return createRef(value, false);
	}
	/* @__NO_SIDE_EFFECTS__ */
	function shallowRef(value) {
		return createRef(value, true);
	}
	function createRef(rawValue, shallow) {
		if (/* @__PURE__ */ isRef(rawValue)) return rawValue;
		return new RefImpl(rawValue, shallow);
	}
	var RefImpl = class {
		constructor(value, isShallow2) {
			this.dep = new Dep();
			this["__v_isRef"] = true;
			this["__v_isShallow"] = false;
			this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
			this._value = isShallow2 ? value : toReactive(value);
			this["__v_isShallow"] = isShallow2;
		}
		get value() {
			this.dep.track();
			return this._value;
		}
		set value(newValue) {
			const oldValue = this._rawValue;
			const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
			newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
			if (hasChanged(newValue, oldValue)) {
				this._rawValue = newValue;
				this._value = useDirectValue ? newValue : toReactive(newValue);
				this.dep.trigger();
			}
		}
	};
	function triggerRef(ref2) {
		if (ref2.dep) ref2.dep.trigger();
	}
	function unref(ref2) {
		return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
	}
	function toValue(source) {
		return isFunction(source) ? source() : unref(source);
	}
	var shallowUnwrapHandlers = {
		get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
		set: (target, key, value, receiver) => {
			const oldValue = target[key];
			if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
				oldValue.value = value;
				return true;
			} else return Reflect.set(target, key, value, receiver);
		}
	};
	function proxyRefs(objectWithRefs) {
		return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
	}
	var CustomRefImpl = class {
		constructor(factory) {
			this["__v_isRef"] = true;
			this._value = void 0;
			const dep = this.dep = new Dep();
			const { get, set } = factory(dep.track.bind(dep), dep.trigger.bind(dep));
			this._get = get;
			this._set = set;
		}
		get value() {
			return this._value = this._get();
		}
		set value(newVal) {
			this._set(newVal);
		}
	};
	function customRef(factory) {
		return new CustomRefImpl(factory);
	}
	/* @__NO_SIDE_EFFECTS__ */
	function toRefs(object) {
		const ret = isArray(object) ? new Array(object.length) : {};
		for (const key in object) ret[key] = propertyToRef(object, key);
		return ret;
	}
	var ObjectRefImpl = class {
		constructor(_object, key, _defaultValue) {
			this._object = _object;
			this._defaultValue = _defaultValue;
			this["__v_isRef"] = true;
			this._value = void 0;
			this._key = isSymbol(key) ? key : String(key);
			this._raw = /* @__PURE__ */ toRaw(_object);
			let shallow = true;
			let obj = _object;
			if (!isArray(_object) || isSymbol(this._key) || !isIntegerKey(this._key)) do
				shallow = !/* @__PURE__ */ isProxy(obj) || /* @__PURE__ */ isShallow(obj);
			while (shallow && (obj = obj["__v_raw"]));
			this._shallow = shallow;
		}
		get value() {
			let val = this._object[this._key];
			if (this._shallow) val = unref(val);
			return this._value = val === void 0 ? this._defaultValue : val;
		}
		set value(newVal) {
			if (this._shallow && /* @__PURE__ */ isRef(this._raw[this._key])) {
				const nestedRef = this._object[this._key];
				if (/* @__PURE__ */ isRef(nestedRef)) {
					nestedRef.value = newVal;
					return;
				}
			}
			this._object[this._key] = newVal;
		}
		get dep() {
			return getDepFromReactive(this._raw, this._key);
		}
	};
	var GetterRefImpl = class {
		constructor(_getter) {
			this._getter = _getter;
			this["__v_isRef"] = true;
			this["__v_isReadonly"] = true;
			this._value = void 0;
		}
		get value() {
			return this._value = this._getter();
		}
	};
	/* @__NO_SIDE_EFFECTS__ */
	function toRef$1(source, key, defaultValue) {
		if (/* @__PURE__ */ isRef(source)) return source;
		else if (isFunction(source)) return new GetterRefImpl(source);
		else if (isObject$1(source) && arguments.length > 1) return propertyToRef(source, key, defaultValue);
		else return /* @__PURE__ */ ref(source);
	}
	function propertyToRef(source, key, defaultValue) {
		return new ObjectRefImpl(source, key, defaultValue);
	}
	var ComputedRefImpl = class {
		constructor(fn, setter, isSSR) {
			this.fn = fn;
			this.setter = setter;
			/**
			* @internal
			*/
			this._value = void 0;
			/**
			* @internal
			*/
			this.dep = new Dep(this);
			/**
			* @internal
			*/
			this.__v_isRef = true;
			/**
			* @internal
			*/
			this.deps = void 0;
			/**
			* @internal
			*/
			this.depsTail = void 0;
			/**
			* @internal
			*/
			this.flags = 16;
			/**
			* @internal
			*/
			this.globalVersion = globalVersion - 1;
			/**
			* @internal
			*/
			this.next = void 0;
			this.effect = this;
			this["__v_isReadonly"] = !setter;
			this.isSSR = isSSR;
		}
		/**
		* @internal
		*/
		notify() {
			this.flags |= 16;
			if (!(this.flags & 8) && activeSub !== this) {
				batch(this, true);
				return true;
			}
		}
		get value() {
			const link = this.dep.track();
			refreshComputed(this);
			if (link) link.version = this.dep.version;
			return this._value;
		}
		set value(newValue) {
			if (this.setter) this.setter(newValue);
		}
	};
	/* @__NO_SIDE_EFFECTS__ */
	function computed$1(getterOrOptions, debugOptions, isSSR = false) {
		let getter;
		let setter;
		if (isFunction(getterOrOptions)) getter = getterOrOptions;
		else {
			getter = getterOrOptions.get;
			setter = getterOrOptions.set;
		}
		return new ComputedRefImpl(getter, setter, isSSR);
	}
	var TrackOpTypes = {
		"GET": "get",
		"HAS": "has",
		"ITERATE": "iterate"
	};
	var TriggerOpTypes = {
		"SET": "set",
		"ADD": "add",
		"DELETE": "delete",
		"CLEAR": "clear"
	};
	var INITIAL_WATCHER_VALUE = {};
	var cleanupMap = /* @__PURE__ */ new WeakMap();
	var activeWatcher = void 0;
	function getCurrentWatcher() {
		return activeWatcher;
	}
	function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
		if (owner) {
			let cleanups = cleanupMap.get(owner);
			if (!cleanups) cleanupMap.set(owner, cleanups = []);
			cleanups.push(cleanupFn);
		}
	}
	function watch$1(source, cb, options = EMPTY_OBJ) {
		const { immediate, deep, once, scheduler, augmentJob, call } = options;
		const reactiveGetter = (source2) => {
			if (deep) return source2;
			if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0) return traverse(source2, 1);
			return traverse(source2);
		};
		let effect;
		let getter;
		let cleanup;
		let boundCleanup;
		let forceTrigger = false;
		let isMultiSource = false;
		if (/* @__PURE__ */ isRef(source)) {
			getter = () => source.value;
			forceTrigger = /* @__PURE__ */ isShallow(source);
		} else if (/* @__PURE__ */ isReactive(source)) {
			getter = () => reactiveGetter(source);
			forceTrigger = true;
		} else if (isArray(source)) {
			isMultiSource = true;
			forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
			getter = () => source.map((s) => {
				if (/* @__PURE__ */ isRef(s)) return s.value;
				else if (/* @__PURE__ */ isReactive(s)) return reactiveGetter(s);
				else if (isFunction(s)) return call ? call(s, 2) : s();
			});
		} else if (isFunction(source)) if (cb) getter = call ? () => call(source, 2) : source;
		else getter = () => {
			if (cleanup) {
				pauseTracking();
				try {
					cleanup();
				} finally {
					resetTracking();
				}
			}
			const currentEffect = activeWatcher;
			activeWatcher = effect;
			try {
				return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
			} finally {
				activeWatcher = currentEffect;
			}
		};
		else getter = NOOP;
		if (cb && deep) {
			const baseGetter = getter;
			const depth = deep === true ? Infinity : deep;
			getter = () => traverse(baseGetter(), depth);
		}
		const scope = getCurrentScope();
		const watchHandle = () => {
			effect.stop();
			if (scope && scope.active) remove(scope.effects, effect);
		};
		if (once && cb) {
			const _cb = cb;
			cb = (...args) => {
				_cb(...args);
				watchHandle();
			};
		}
		let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
		const job = (immediateFirstRun) => {
			if (!(effect.flags & 1) || !effect.dirty && !immediateFirstRun) return;
			if (cb) {
				const newValue = effect.run();
				if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
					if (cleanup) cleanup();
					const currentWatcher = activeWatcher;
					activeWatcher = effect;
					try {
						const args = [
							newValue,
							oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
							boundCleanup
						];
						oldValue = newValue;
						call ? call(cb, 3, args) : cb(...args);
					} finally {
						activeWatcher = currentWatcher;
					}
				}
			} else effect.run();
		};
		if (augmentJob) augmentJob(job);
		effect = new ReactiveEffect(getter);
		effect.scheduler = scheduler ? () => scheduler(job, false) : job;
		boundCleanup = (fn) => onWatcherCleanup(fn, false, effect);
		cleanup = effect.onStop = () => {
			const cleanups = cleanupMap.get(effect);
			if (cleanups) {
				if (call) call(cleanups, 4);
				else for (const cleanup2 of cleanups) cleanup2();
				cleanupMap.delete(effect);
			}
		};
		if (cb) if (immediate) job(true);
		else oldValue = effect.run();
		else if (scheduler) scheduler(job.bind(null, true), true);
		else effect.run();
		watchHandle.pause = effect.pause.bind(effect);
		watchHandle.resume = effect.resume.bind(effect);
		watchHandle.stop = watchHandle;
		return watchHandle;
	}
	function traverse(value, depth = Infinity, seen) {
		if (depth <= 0 || !isObject$1(value) || value["__v_skip"]) return value;
		seen = seen || /* @__PURE__ */ new Map();
		if ((seen.get(value) || 0) >= depth) return value;
		seen.set(value, depth);
		depth--;
		if (/* @__PURE__ */ isRef(value)) traverse(value.value, depth, seen);
		else if (isArray(value)) for (let i = 0; i < value.length; i++) traverse(value[i], depth, seen);
		else if (isSet(value) || isMap(value)) value.forEach((v) => {
			traverse(v, depth, seen);
		});
		else if (isPlainObject$2(value)) {
			for (const key in value) traverse(value[key], depth, seen);
			for (const key of Object.getOwnPropertySymbols(value)) if (Object.prototype.propertyIsEnumerable.call(value, key)) traverse(value[key], depth, seen);
		}
		return value;
	}
	//#endregion
	//#region node_modules/.pnpm/@vue+runtime-core@3.5.32/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
	/**
	* @vue/runtime-core v3.5.32
	* (c) 2018-present Yuxi (Evan) You and Vue contributors
	* @license MIT
	**/
	var stack = [];
	function pushWarningContext(vnode) {
		stack.push(vnode);
	}
	function popWarningContext() {
		stack.pop();
	}
	function assertNumber(val, type) {}
	var ErrorCodes = {
		"SETUP_FUNCTION": 0,
		"0": "SETUP_FUNCTION",
		"RENDER_FUNCTION": 1,
		"1": "RENDER_FUNCTION",
		"NATIVE_EVENT_HANDLER": 5,
		"5": "NATIVE_EVENT_HANDLER",
		"COMPONENT_EVENT_HANDLER": 6,
		"6": "COMPONENT_EVENT_HANDLER",
		"VNODE_HOOK": 7,
		"7": "VNODE_HOOK",
		"DIRECTIVE_HOOK": 8,
		"8": "DIRECTIVE_HOOK",
		"TRANSITION_HOOK": 9,
		"9": "TRANSITION_HOOK",
		"APP_ERROR_HANDLER": 10,
		"10": "APP_ERROR_HANDLER",
		"APP_WARN_HANDLER": 11,
		"11": "APP_WARN_HANDLER",
		"FUNCTION_REF": 12,
		"12": "FUNCTION_REF",
		"ASYNC_COMPONENT_LOADER": 13,
		"13": "ASYNC_COMPONENT_LOADER",
		"SCHEDULER": 14,
		"14": "SCHEDULER",
		"COMPONENT_UPDATE": 15,
		"15": "COMPONENT_UPDATE",
		"APP_UNMOUNT_CLEANUP": 16,
		"16": "APP_UNMOUNT_CLEANUP"
	};
	var ErrorTypeStrings$1 = {
		["sp"]: "serverPrefetch hook",
		["bc"]: "beforeCreate hook",
		["c"]: "created hook",
		["bm"]: "beforeMount hook",
		["m"]: "mounted hook",
		["bu"]: "beforeUpdate hook",
		["u"]: "updated",
		["bum"]: "beforeUnmount hook",
		["um"]: "unmounted hook",
		["a"]: "activated hook",
		["da"]: "deactivated hook",
		["ec"]: "errorCaptured hook",
		["rtc"]: "renderTracked hook",
		["rtg"]: "renderTriggered hook",
		[0]: "setup function",
		[1]: "render function",
		[2]: "watcher getter",
		[3]: "watcher callback",
		[4]: "watcher cleanup function",
		[5]: "native event handler",
		[6]: "component event handler",
		[7]: "vnode hook",
		[8]: "directive hook",
		[9]: "transition hook",
		[10]: "app errorHandler",
		[11]: "app warnHandler",
		[12]: "ref function",
		[13]: "async component loader",
		[14]: "scheduler flush",
		[15]: "component update",
		[16]: "app unmount cleanup function"
	};
	function callWithErrorHandling(fn, instance, type, args) {
		try {
			return args ? fn(...args) : fn();
		} catch (err) {
			handleError(err, instance, type);
		}
	}
	function callWithAsyncErrorHandling(fn, instance, type, args) {
		if (isFunction(fn)) {
			const res = callWithErrorHandling(fn, instance, type, args);
			if (res && isPromise(res)) res.catch((err) => {
				handleError(err, instance, type);
			});
			return res;
		}
		if (isArray(fn)) {
			const values = [];
			for (let i = 0; i < fn.length; i++) values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
			return values;
		}
	}
	function handleError(err, instance, type, throwInDev = true) {
		const contextVNode = instance ? instance.vnode : null;
		const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
		if (instance) {
			let cur = instance.parent;
			const exposedInstance = instance.proxy;
			const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
			while (cur) {
				const errorCapturedHooks = cur.ec;
				if (errorCapturedHooks) {
					for (let i = 0; i < errorCapturedHooks.length; i++) if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) return;
				}
				cur = cur.parent;
			}
			if (errorHandler) {
				pauseTracking();
				callWithErrorHandling(errorHandler, null, 10, [
					err,
					exposedInstance,
					errorInfo
				]);
				resetTracking();
				return;
			}
		}
		logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
	}
	function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
		if (throwInProd) throw err;
		else console.error(err);
	}
	var queue = [];
	var flushIndex = -1;
	var pendingPostFlushCbs = [];
	var activePostFlushCbs = null;
	var postFlushIndex = 0;
	var resolvedPromise = /* @__PURE__ */ Promise.resolve();
	var currentFlushPromise = null;
	function nextTick(fn) {
		const p = currentFlushPromise || resolvedPromise;
		return fn ? p.then(this ? fn.bind(this) : fn) : p;
	}
	function findInsertionIndex(id) {
		let start = flushIndex + 1;
		let end = queue.length;
		while (start < end) {
			const middle = start + end >>> 1;
			const middleJob = queue[middle];
			const middleJobId = getId(middleJob);
			if (middleJobId < id || middleJobId === id && middleJob.flags & 2) start = middle + 1;
			else end = middle;
		}
		return start;
	}
	function queueJob(job) {
		if (!(job.flags & 1)) {
			const jobId = getId(job);
			const lastJob = queue[queue.length - 1];
			if (!lastJob || !(job.flags & 2) && jobId >= getId(lastJob)) queue.push(job);
			else queue.splice(findInsertionIndex(jobId), 0, job);
			job.flags |= 1;
			queueFlush();
		}
	}
	function queueFlush() {
		if (!currentFlushPromise) currentFlushPromise = resolvedPromise.then(flushJobs);
	}
	function queuePostFlushCb(cb) {
		if (!isArray(cb)) {
			if (activePostFlushCbs && cb.id === -1) activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
			else if (!(cb.flags & 1)) {
				pendingPostFlushCbs.push(cb);
				cb.flags |= 1;
			}
		} else pendingPostFlushCbs.push(...cb);
		queueFlush();
	}
	function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
		for (; i < queue.length; i++) {
			const cb = queue[i];
			if (cb && cb.flags & 2) {
				if (instance && cb.id !== instance.uid) continue;
				queue.splice(i, 1);
				i--;
				if (cb.flags & 4) cb.flags &= -2;
				cb();
				if (!(cb.flags & 4)) cb.flags &= -2;
			}
		}
	}
	function flushPostFlushCbs(seen) {
		if (pendingPostFlushCbs.length) {
			const deduped = [...new Set(pendingPostFlushCbs)].sort((a, b) => getId(a) - getId(b));
			pendingPostFlushCbs.length = 0;
			if (activePostFlushCbs) {
				activePostFlushCbs.push(...deduped);
				return;
			}
			activePostFlushCbs = deduped;
			for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
				const cb = activePostFlushCbs[postFlushIndex];
				if (cb.flags & 4) cb.flags &= -2;
				if (!(cb.flags & 8)) cb();
				cb.flags &= -2;
			}
			activePostFlushCbs = null;
			postFlushIndex = 0;
		}
	}
	var getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
	function flushJobs(seen) {
		try {
			for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
				const job = queue[flushIndex];
				if (job && !(job.flags & 8)) {
					if (job.flags & 4) job.flags &= -2;
					callWithErrorHandling(job, job.i, job.i ? 15 : 14);
					if (!(job.flags & 4)) job.flags &= -2;
				}
			}
		} finally {
			for (; flushIndex < queue.length; flushIndex++) {
				const job = queue[flushIndex];
				if (job) job.flags &= -2;
			}
			flushIndex = -1;
			queue.length = 0;
			flushPostFlushCbs(seen);
			currentFlushPromise = null;
			if (queue.length || pendingPostFlushCbs.length) flushJobs(seen);
		}
	}
	var devtools$1;
	var buffer = [];
	function setDevtoolsHook$1(hook, target) {
		var _a, _b;
		devtools$1 = hook;
		if (devtools$1) {
			devtools$1.enabled = true;
			buffer.forEach(({ event, args }) => devtools$1.emit(event, ...args));
			buffer = [];
		} else if (typeof window !== "undefined" && window.HTMLElement && !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))) {
			(target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((newHook) => {
				setDevtoolsHook$1(newHook, target);
			});
			setTimeout(() => {
				if (!devtools$1) {
					target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
					buffer = [];
				}
			}, 3e3);
		} else buffer = [];
	}
	var currentRenderingInstance = null;
	var currentScopeId = null;
	function setCurrentRenderingInstance(instance) {
		const prev = currentRenderingInstance;
		currentRenderingInstance = instance;
		currentScopeId = instance && instance.type.__scopeId || null;
		return prev;
	}
	function pushScopeId(id) {
		currentScopeId = id;
	}
	function popScopeId() {
		currentScopeId = null;
	}
	var withScopeId = (_id) => withCtx;
	function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
		if (!ctx) return fn;
		if (fn._n) return fn;
		const renderFnWithContext = (...args) => {
			if (renderFnWithContext._d) setBlockTracking(-1);
			const prevInstance = setCurrentRenderingInstance(ctx);
			let res;
			try {
				res = fn(...args);
			} finally {
				setCurrentRenderingInstance(prevInstance);
				if (renderFnWithContext._d) setBlockTracking(1);
			}
			return res;
		};
		renderFnWithContext._n = true;
		renderFnWithContext._c = true;
		renderFnWithContext._d = true;
		return renderFnWithContext;
	}
	function withDirectives(vnode, directives) {
		if (currentRenderingInstance === null) return vnode;
		const instance = getComponentPublicInstance(currentRenderingInstance);
		const bindings = vnode.dirs || (vnode.dirs = []);
		for (let i = 0; i < directives.length; i++) {
			let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
			if (dir) {
				if (isFunction(dir)) dir = {
					mounted: dir,
					updated: dir
				};
				if (dir.deep) traverse(value);
				bindings.push({
					dir,
					instance,
					value,
					oldValue: void 0,
					arg,
					modifiers
				});
			}
		}
		return vnode;
	}
	function invokeDirectiveHook(vnode, prevVNode, instance, name) {
		const bindings = vnode.dirs;
		const oldBindings = prevVNode && prevVNode.dirs;
		for (let i = 0; i < bindings.length; i++) {
			const binding = bindings[i];
			if (oldBindings) binding.oldValue = oldBindings[i].value;
			let hook = binding.dir[name];
			if (hook) {
				pauseTracking();
				callWithAsyncErrorHandling(hook, instance, 8, [
					vnode.el,
					binding,
					vnode,
					prevVNode
				]);
				resetTracking();
			}
		}
	}
	function provide(key, value) {
		if (currentInstance) {
			let provides = currentInstance.provides;
			const parentProvides = currentInstance.parent && currentInstance.parent.provides;
			if (parentProvides === provides) provides = currentInstance.provides = Object.create(parentProvides);
			provides[key] = value;
		}
	}
	function inject(key, defaultValue, treatDefaultAsFactory = false) {
		const instance = getCurrentInstance();
		if (instance || currentApp) {
			let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
			if (provides && key in provides) return provides[key];
			else if (arguments.length > 1) return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
		}
	}
	function hasInjectionContext() {
		return !!(getCurrentInstance() || currentApp);
	}
	var ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
	var useSSRContext = () => {
		{
			const ctx = inject(ssrContextKey);
			if (!ctx) {}
			return ctx;
		}
	};
	function watchEffect(effect, options) {
		return doWatch(effect, null, options);
	}
	function watchPostEffect(effect, options) {
		return doWatch(effect, null, { flush: "post" });
	}
	function watchSyncEffect(effect, options) {
		return doWatch(effect, null, { flush: "sync" });
	}
	function watch(source, cb, options) {
		return doWatch(source, cb, options);
	}
	function doWatch(source, cb, options = EMPTY_OBJ) {
		const { immediate, deep, flush, once } = options;
		const baseWatchOptions = extend({}, options);
		const runsImmediately = cb && immediate || !cb && flush !== "post";
		let ssrCleanup;
		if (isInSSRComponentSetup) {
			if (flush === "sync") {
				const ctx = useSSRContext();
				ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
			} else if (!runsImmediately) {
				const watchStopHandle = () => {};
				watchStopHandle.stop = NOOP;
				watchStopHandle.resume = NOOP;
				watchStopHandle.pause = NOOP;
				return watchStopHandle;
			}
		}
		const instance = currentInstance;
		baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
		let isPre = false;
		if (flush === "post") baseWatchOptions.scheduler = (job) => {
			queuePostRenderEffect(job, instance && instance.suspense);
		};
		else if (flush !== "sync") {
			isPre = true;
			baseWatchOptions.scheduler = (job, isFirstRun) => {
				if (isFirstRun) job();
				else queueJob(job);
			};
		}
		baseWatchOptions.augmentJob = (job) => {
			if (cb) job.flags |= 4;
			if (isPre) {
				job.flags |= 2;
				if (instance) {
					job.id = instance.uid;
					job.i = instance;
				}
			}
		};
		const watchHandle = watch$1(source, cb, baseWatchOptions);
		if (isInSSRComponentSetup) {
			if (ssrCleanup) ssrCleanup.push(watchHandle);
			else if (runsImmediately) watchHandle();
		}
		return watchHandle;
	}
	function instanceWatch(source, value, options) {
		const publicThis = this.proxy;
		const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
		let cb;
		if (isFunction(value)) cb = value;
		else {
			cb = value.handler;
			options = value;
		}
		const reset = setCurrentInstance(this);
		const res = doWatch(getter, cb.bind(publicThis), options);
		reset();
		return res;
	}
	function createPathGetter(ctx, path) {
		const segments = path.split(".");
		return () => {
			let cur = ctx;
			for (let i = 0; i < segments.length && cur; i++) cur = cur[segments[i]];
			return cur;
		};
	}
	var pendingMounts = /* @__PURE__ */ new WeakMap();
	var TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
	var isTeleport = (type) => type.__isTeleport;
	var isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
	var isTeleportDeferred = (props) => props && (props.defer || props.defer === "");
	var isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
	var isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
	var resolveTarget = (props, select) => {
		const targetSelector = props && props.to;
		if (isString(targetSelector)) if (!select) return null;
		else return select(targetSelector);
		else return targetSelector;
	};
	var TeleportImpl = {
		name: "Teleport",
		__isTeleport: true,
		process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
			const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
			const disabled = isTeleportDisabled(n2.props);
			let { dynamicChildren } = n2;
			const mount = (vnode, container2, anchor2) => {
				if (vnode.shapeFlag & 16) mountChildren(vnode.children, container2, anchor2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			};
			const mountToTarget = (vnode = n2) => {
				const disabled2 = isTeleportDisabled(vnode.props);
				const target = vnode.target = resolveTarget(vnode.props, querySelector);
				const targetAnchor = prepareAnchor(target, vnode, createText, insert);
				if (target) {
					if (namespace !== "svg" && isTargetSVG(target)) namespace = "svg";
					else if (namespace !== "mathml" && isTargetMathML(target)) namespace = "mathml";
					if (parentComponent && parentComponent.isCE) (parentComponent.ce._teleportTargets || (parentComponent.ce._teleportTargets = /* @__PURE__ */ new Set())).add(target);
					if (!disabled2) {
						mount(vnode, target, targetAnchor);
						updateCssVars(vnode, false);
					}
				}
			};
			const queuePendingMount = (vnode) => {
				const mountJob = () => {
					if (pendingMounts.get(vnode) !== mountJob) return;
					pendingMounts.delete(vnode);
					if (isTeleportDisabled(vnode.props)) {
						mount(vnode, container, vnode.anchor);
						updateCssVars(vnode, true);
					}
					mountToTarget(vnode);
				};
				pendingMounts.set(vnode, mountJob);
				queuePostRenderEffect(mountJob, parentSuspense);
			};
			if (n1 == null) {
				const placeholder = n2.el = createText("");
				const mainAnchor = n2.anchor = createText("");
				insert(placeholder, container, anchor);
				insert(mainAnchor, container, anchor);
				if (isTeleportDeferred(n2.props) || parentSuspense && parentSuspense.pendingBranch) {
					queuePendingMount(n2);
					return;
				}
				if (disabled) {
					mount(n2, container, mainAnchor);
					updateCssVars(n2, true);
				}
				mountToTarget();
			} else {
				n2.el = n1.el;
				const mainAnchor = n2.anchor = n1.anchor;
				const pendingMount = pendingMounts.get(n1);
				if (pendingMount) {
					pendingMount.flags |= 8;
					pendingMounts.delete(n1);
					queuePendingMount(n2);
					return;
				}
				n2.targetStart = n1.targetStart;
				const target = n2.target = n1.target;
				const targetAnchor = n2.targetAnchor = n1.targetAnchor;
				const wasDisabled = isTeleportDisabled(n1.props);
				const currentContainer = wasDisabled ? container : target;
				const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
				if (namespace === "svg" || isTargetSVG(target)) namespace = "svg";
				else if (namespace === "mathml" || isTargetMathML(target)) namespace = "mathml";
				if (dynamicChildren) {
					patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, namespace, slotScopeIds);
					traverseStaticChildren(n1, n2, true);
				} else if (!optimized) patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, false);
				if (disabled) {
					if (!wasDisabled) moveTeleport(n2, container, mainAnchor, internals, 1);
					else if (n2.props && n1.props && n2.props.to !== n1.props.to) n2.props.to = n1.props.to;
				} else if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
					const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
					if (nextTarget) moveTeleport(n2, nextTarget, null, internals, 0);
				} else if (wasDisabled) moveTeleport(n2, target, targetAnchor, internals, 1);
				updateCssVars(n2, disabled);
			}
		},
		remove(vnode, parentComponent, parentSuspense, { um: unmount, o: { remove: hostRemove } }, doRemove) {
			const { shapeFlag, children, anchor, targetStart, targetAnchor, target, props } = vnode;
			let shouldRemove = doRemove || !isTeleportDisabled(props);
			const pendingMount = pendingMounts.get(vnode);
			if (pendingMount) {
				pendingMount.flags |= 8;
				pendingMounts.delete(vnode);
				shouldRemove = false;
			}
			if (target) {
				hostRemove(targetStart);
				hostRemove(targetAnchor);
			}
			doRemove && hostRemove(anchor);
			if (shapeFlag & 16) for (let i = 0; i < children.length; i++) {
				const child = children[i];
				unmount(child, parentComponent, parentSuspense, shouldRemove, !!child.dynamicChildren);
			}
		},
		move: moveTeleport,
		hydrate: hydrateTeleport
	};
	function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
		if (moveType === 0) insert(vnode.targetAnchor, container, parentAnchor);
		const { el, anchor, shapeFlag, children, props } = vnode;
		const isReorder = moveType === 2;
		if (isReorder) insert(el, container, parentAnchor);
		if (!isReorder || isTeleportDisabled(props)) {
			if (shapeFlag & 16) for (let i = 0; i < children.length; i++) move(children[i], container, parentAnchor, 2);
		}
		if (isReorder) insert(anchor, container, parentAnchor);
	}
	function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, { o: { nextSibling, parentNode, querySelector, insert, createText } }, hydrateChildren) {
		function hydrateAnchor(target2, targetNode) {
			let targetAnchor = targetNode;
			while (targetAnchor) {
				if (targetAnchor && targetAnchor.nodeType === 8) {
					if (targetAnchor.data === "teleport start anchor") vnode.targetStart = targetAnchor;
					else if (targetAnchor.data === "teleport anchor") {
						vnode.targetAnchor = targetAnchor;
						target2._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
						break;
					}
				}
				targetAnchor = nextSibling(targetAnchor);
			}
		}
		function hydrateDisabledTeleport(node2, vnode2) {
			vnode2.anchor = hydrateChildren(nextSibling(node2), vnode2, parentNode(node2), parentComponent, parentSuspense, slotScopeIds, optimized);
		}
		const target = vnode.target = resolveTarget(vnode.props, querySelector);
		const disabled = isTeleportDisabled(vnode.props);
		if (target) {
			const targetNode = target._lpa || target.firstChild;
			if (vnode.shapeFlag & 16) if (disabled) {
				hydrateDisabledTeleport(node, vnode);
				hydrateAnchor(target, targetNode);
				if (!vnode.targetAnchor) prepareAnchor(target, vnode, createText, insert, parentNode(node) === target ? node : null);
			} else {
				vnode.anchor = nextSibling(node);
				hydrateAnchor(target, targetNode);
				if (!vnode.targetAnchor) prepareAnchor(target, vnode, createText, insert);
				hydrateChildren(targetNode && nextSibling(targetNode), vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
			}
			updateCssVars(vnode, disabled);
		} else if (disabled) {
			if (vnode.shapeFlag & 16) {
				hydrateDisabledTeleport(node, vnode);
				vnode.targetStart = node;
				vnode.targetAnchor = nextSibling(node);
			}
		}
		return vnode.anchor && nextSibling(vnode.anchor);
	}
	var Teleport = TeleportImpl;
	function updateCssVars(vnode, isDisabled) {
		const ctx = vnode.ctx;
		if (ctx && ctx.ut) {
			let node, anchor;
			if (isDisabled) {
				node = vnode.el;
				anchor = vnode.anchor;
			} else {
				node = vnode.targetStart;
				anchor = vnode.targetAnchor;
			}
			while (node && node !== anchor) {
				if (node.nodeType === 1) node.setAttribute("data-v-owner", ctx.uid);
				node = node.nextSibling;
			}
			ctx.ut();
		}
	}
	function prepareAnchor(target, vnode, createText, insert, anchor = null) {
		const targetStart = vnode.targetStart = createText("");
		const targetAnchor = vnode.targetAnchor = createText("");
		targetStart[TeleportEndKey] = targetAnchor;
		if (target) {
			insert(targetStart, target, anchor);
			insert(targetAnchor, target, anchor);
		}
		return targetAnchor;
	}
	var leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
	var enterCbKey$1 = /* @__PURE__ */ Symbol("_enterCb");
	function useTransitionState() {
		const state = {
			isMounted: false,
			isLeaving: false,
			isUnmounting: false,
			leavingVNodes: /* @__PURE__ */ new Map()
		};
		onMounted(() => {
			state.isMounted = true;
		});
		onBeforeUnmount(() => {
			state.isUnmounting = true;
		});
		return state;
	}
	var TransitionHookValidator = [Function, Array];
	var BaseTransitionPropsValidators = {
		mode: String,
		appear: Boolean,
		persisted: Boolean,
		onBeforeEnter: TransitionHookValidator,
		onEnter: TransitionHookValidator,
		onAfterEnter: TransitionHookValidator,
		onEnterCancelled: TransitionHookValidator,
		onBeforeLeave: TransitionHookValidator,
		onLeave: TransitionHookValidator,
		onAfterLeave: TransitionHookValidator,
		onLeaveCancelled: TransitionHookValidator,
		onBeforeAppear: TransitionHookValidator,
		onAppear: TransitionHookValidator,
		onAfterAppear: TransitionHookValidator,
		onAppearCancelled: TransitionHookValidator
	};
	var recursiveGetSubtree = (instance) => {
		const subTree = instance.subTree;
		return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
	};
	var BaseTransitionImpl = {
		name: `BaseTransition`,
		props: BaseTransitionPropsValidators,
		setup(props, { slots }) {
			const instance = getCurrentInstance();
			const state = useTransitionState();
			return () => {
				const children = slots.default && getTransitionRawChildren(slots.default(), true);
				if (!children || !children.length) return;
				const child = findNonCommentChild(children);
				const rawProps = /* @__PURE__ */ toRaw(props);
				const { mode } = rawProps;
				if (state.isLeaving) return emptyPlaceholder(child);
				const innerChild = getInnerChild$1(child);
				if (!innerChild) return emptyPlaceholder(child);
				let enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance, (hooks) => enterHooks = hooks);
				if (innerChild.type !== Comment) setTransitionHooks(innerChild, enterHooks);
				let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
				if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(oldInnerChild, innerChild) && recursiveGetSubtree(instance).type !== Comment) {
					let leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
					setTransitionHooks(oldInnerChild, leavingHooks);
					if (mode === "out-in" && innerChild.type !== Comment) {
						state.isLeaving = true;
						leavingHooks.afterLeave = () => {
							state.isLeaving = false;
							if (!(instance.job.flags & 8)) instance.update();
							delete leavingHooks.afterLeave;
							oldInnerChild = void 0;
						};
						return emptyPlaceholder(child);
					} else if (mode === "in-out" && innerChild.type !== Comment) leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
						const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
						leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
						el[leaveCbKey] = () => {
							earlyRemove();
							el[leaveCbKey] = void 0;
							delete enterHooks.delayedLeave;
							oldInnerChild = void 0;
						};
						enterHooks.delayedLeave = () => {
							delayedLeave();
							delete enterHooks.delayedLeave;
							oldInnerChild = void 0;
						};
					};
					else oldInnerChild = void 0;
				} else if (oldInnerChild) oldInnerChild = void 0;
				return child;
			};
		}
	};
	function findNonCommentChild(children) {
		let child = children[0];
		if (children.length > 1) {
			for (const c of children) if (c.type !== Comment) {
				child = c;
				break;
			}
		}
		return child;
	}
	var BaseTransition = BaseTransitionImpl;
	function getLeavingNodesForType(state, vnode) {
		const { leavingVNodes } = state;
		let leavingVNodesCache = leavingVNodes.get(vnode.type);
		if (!leavingVNodesCache) {
			leavingVNodesCache = /* @__PURE__ */ Object.create(null);
			leavingVNodes.set(vnode.type, leavingVNodesCache);
		}
		return leavingVNodesCache;
	}
	function resolveTransitionHooks(vnode, props, state, instance, postClone) {
		const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
		const key = String(vnode.key);
		const leavingVNodesCache = getLeavingNodesForType(state, vnode);
		const callHook = (hook, args) => {
			hook && callWithAsyncErrorHandling(hook, instance, 9, args);
		};
		const callAsyncHook = (hook, args) => {
			const done = args[1];
			callHook(hook, args);
			if (isArray(hook)) {
				if (hook.every((hook2) => hook2.length <= 1)) done();
			} else if (hook.length <= 1) done();
		};
		const hooks = {
			mode,
			persisted,
			beforeEnter(el) {
				let hook = onBeforeEnter;
				if (!state.isMounted) if (appear) hook = onBeforeAppear || onBeforeEnter;
				else return;
				if (el[leaveCbKey]) el[leaveCbKey](true);
				const leavingVNode = leavingVNodesCache[key];
				if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) leavingVNode.el[leaveCbKey]();
				callHook(hook, [el]);
			},
			enter(el) {
				if (leavingVNodesCache[key] === vnode) return;
				let hook = onEnter;
				let afterHook = onAfterEnter;
				let cancelHook = onEnterCancelled;
				if (!state.isMounted) if (appear) {
					hook = onAppear || onEnter;
					afterHook = onAfterAppear || onAfterEnter;
					cancelHook = onAppearCancelled || onEnterCancelled;
				} else return;
				let called = false;
				el[enterCbKey$1] = (cancelled) => {
					if (called) return;
					called = true;
					if (cancelled) callHook(cancelHook, [el]);
					else callHook(afterHook, [el]);
					if (hooks.delayedLeave) hooks.delayedLeave();
					el[enterCbKey$1] = void 0;
				};
				const done = el[enterCbKey$1].bind(null, false);
				if (hook) callAsyncHook(hook, [el, done]);
				else done();
			},
			leave(el, remove) {
				const key2 = String(vnode.key);
				if (el[enterCbKey$1]) el[enterCbKey$1](true);
				if (state.isUnmounting) return remove();
				callHook(onBeforeLeave, [el]);
				let called = false;
				el[leaveCbKey] = (cancelled) => {
					if (called) return;
					called = true;
					remove();
					if (cancelled) callHook(onLeaveCancelled, [el]);
					else callHook(onAfterLeave, [el]);
					el[leaveCbKey] = void 0;
					if (leavingVNodesCache[key2] === vnode) delete leavingVNodesCache[key2];
				};
				const done = el[leaveCbKey].bind(null, false);
				leavingVNodesCache[key2] = vnode;
				if (onLeave) callAsyncHook(onLeave, [el, done]);
				else done();
			},
			clone(vnode2) {
				const hooks2 = resolveTransitionHooks(vnode2, props, state, instance, postClone);
				if (postClone) postClone(hooks2);
				return hooks2;
			}
		};
		return hooks;
	}
	function emptyPlaceholder(vnode) {
		if (isKeepAlive(vnode)) {
			vnode = cloneVNode(vnode);
			vnode.children = null;
			return vnode;
		}
	}
	function getInnerChild$1(vnode) {
		if (!isKeepAlive(vnode)) {
			if (isTeleport(vnode.type) && vnode.children) return findNonCommentChild(vnode.children);
			return vnode;
		}
		if (vnode.component) return vnode.component.subTree;
		const { shapeFlag, children } = vnode;
		if (children) {
			if (shapeFlag & 16) return children[0];
			if (shapeFlag & 32 && isFunction(children.default)) return children.default();
		}
	}
	function setTransitionHooks(vnode, hooks) {
		if (vnode.shapeFlag & 6 && vnode.component) {
			vnode.transition = hooks;
			setTransitionHooks(vnode.component.subTree, hooks);
		} else if (vnode.shapeFlag & 128) {
			vnode.ssContent.transition = hooks.clone(vnode.ssContent);
			vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
		} else vnode.transition = hooks;
	}
	function getTransitionRawChildren(children, keepComment = false, parentKey) {
		let ret = [];
		let keyedFragmentCount = 0;
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
			if (child.type === Fragment) {
				if (child.patchFlag & 128) keyedFragmentCount++;
				ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
			} else if (keepComment || child.type !== Comment) ret.push(key != null ? cloneVNode(child, { key }) : child);
		}
		if (keyedFragmentCount > 1) for (let i = 0; i < ret.length; i++) ret[i].patchFlag = -2;
		return ret;
	}
	/* @__NO_SIDE_EFFECTS__ */
	function defineComponent(options, extraOptions) {
		return isFunction(options) ? extend({ name: options.name }, extraOptions, { setup: options }) : options;
	}
	function useId$1() {
		const i = getCurrentInstance();
		if (i) return (i.appContext.config.idPrefix || "v") + "-" + i.ids[0] + i.ids[1]++;
		return "";
	}
	function markAsyncBoundary(instance) {
		instance.ids = [
			instance.ids[0] + instance.ids[2]++ + "-",
			0,
			0
		];
	}
	function useTemplateRef(key) {
		const i = getCurrentInstance();
		const r = /* @__PURE__ */ shallowRef(null);
		if (i) {
			const refs = i.refs === EMPTY_OBJ ? i.refs = {} : i.refs;
			Object.defineProperty(refs, key, {
				enumerable: true,
				get: () => r.value,
				set: (val) => r.value = val
			});
		}
		return r;
	}
	function isTemplateRefKey(refs, key) {
		let desc;
		return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
	}
	var pendingSetRefMap = /* @__PURE__ */ new WeakMap();
	function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
		if (isArray(rawRef)) {
			rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
			return;
		}
		if (isAsyncWrapper(vnode) && !isUnmount) {
			if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
			return;
		}
		const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
		const value = isUnmount ? null : refValue;
		const { i: owner, r: ref } = rawRef;
		const oldRef = oldRawRef && oldRawRef.r;
		const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
		const setupState = owner.setupState;
		const rawSetupState = /* @__PURE__ */ toRaw(setupState);
		const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
			if (isTemplateRefKey(refs, key)) return false;
			return hasOwn(rawSetupState, key);
		};
		const canSetRef = (ref2, key) => {
			if (key && isTemplateRefKey(refs, key)) return false;
			return true;
		};
		if (oldRef != null && oldRef !== ref) {
			invalidatePendingSetRef(oldRawRef);
			if (isString(oldRef)) {
				refs[oldRef] = null;
				if (canSetSetupRef(oldRef)) setupState[oldRef] = null;
			} else if (/* @__PURE__ */ isRef(oldRef)) {
				const oldRawRefAtom = oldRawRef;
				if (canSetRef(oldRef, oldRawRefAtom.k)) oldRef.value = null;
				if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
			}
		}
		if (isFunction(ref)) callWithErrorHandling(ref, owner, 12, [value, refs]);
		else {
			const _isString = isString(ref);
			const _isRef = /* @__PURE__ */ isRef(ref);
			if (_isString || _isRef) {
				const doSet = () => {
					if (rawRef.f) {
						const existing = _isString ? canSetSetupRef(ref) ? setupState[ref] : refs[ref] : canSetRef(ref) || !rawRef.k ? ref.value : refs[rawRef.k];
						if (isUnmount) isArray(existing) && remove(existing, refValue);
						else if (!isArray(existing)) if (_isString) {
							refs[ref] = [refValue];
							if (canSetSetupRef(ref)) setupState[ref] = refs[ref];
						} else {
							const newVal = [refValue];
							if (canSetRef(ref, rawRef.k)) ref.value = newVal;
							if (rawRef.k) refs[rawRef.k] = newVal;
						}
						else if (!existing.includes(refValue)) existing.push(refValue);
					} else if (_isString) {
						refs[ref] = value;
						if (canSetSetupRef(ref)) setupState[ref] = value;
					} else if (_isRef) {
						if (canSetRef(ref, rawRef.k)) ref.value = value;
						if (rawRef.k) refs[rawRef.k] = value;
					}
				};
				if (value) {
					const job = () => {
						doSet();
						pendingSetRefMap.delete(rawRef);
					};
					job.id = -1;
					pendingSetRefMap.set(rawRef, job);
					queuePostRenderEffect(job, parentSuspense);
				} else {
					invalidatePendingSetRef(rawRef);
					doSet();
				}
			}
		}
	}
	function invalidatePendingSetRef(rawRef) {
		const pendingSetRef = pendingSetRefMap.get(rawRef);
		if (pendingSetRef) {
			pendingSetRef.flags |= 8;
			pendingSetRefMap.delete(rawRef);
		}
	}
	var hasLoggedMismatchError = false;
	var logMismatchError = () => {
		if (hasLoggedMismatchError) return;
		console.error("Hydration completed but contains mismatches.");
		hasLoggedMismatchError = true;
	};
	var isSVGContainer = (container) => container.namespaceURI.includes("svg") && container.tagName !== "foreignObject";
	var isMathMLContainer = (container) => container.namespaceURI.includes("MathML");
	var getContainerType = (container) => {
		if (container.nodeType !== 1) return void 0;
		if (isSVGContainer(container)) return "svg";
		if (isMathMLContainer(container)) return "mathml";
	};
	var isComment = (node) => node.nodeType === 8;
	function createHydrationFunctions(rendererInternals) {
		const { mt: mountComponent, p: patch, o: { patchProp, createText, nextSibling, parentNode, remove, insert, createComment } } = rendererInternals;
		const hydrate = (vnode, container) => {
			if (!container.hasChildNodes()) {
				patch(null, vnode, container);
				flushPostFlushCbs();
				container._vnode = vnode;
				return;
			}
			hydrateNode(container.firstChild, vnode, null, null, null);
			flushPostFlushCbs();
			container._vnode = vnode;
		};
		const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
			optimized = optimized || !!vnode.dynamicChildren;
			const isFragmentStart = isComment(node) && node.data === "[";
			const onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragmentStart);
			const { type, ref, shapeFlag, patchFlag } = vnode;
			let domType = node.nodeType;
			vnode.el = node;
			if (patchFlag === -2) {
				optimized = false;
				vnode.dynamicChildren = null;
			}
			let nextNode = null;
			switch (type) {
				case Text:
					if (domType !== 3) if (vnode.children === "") {
						insert(vnode.el = createText(""), parentNode(node), node);
						nextNode = node;
					} else nextNode = onMismatch();
					else {
						if (node.data !== vnode.children) {
							logMismatchError();
							node.data = vnode.children;
						}
						nextNode = nextSibling(node);
					}
					break;
				case Comment:
					if (isTemplateNode(node)) {
						nextNode = nextSibling(node);
						replaceNode(vnode.el = node.content.firstChild, node, parentComponent);
					} else if (domType !== 8 || isFragmentStart) nextNode = onMismatch();
					else nextNode = nextSibling(node);
					break;
				case Static:
					if (isFragmentStart) {
						node = nextSibling(node);
						domType = node.nodeType;
					}
					if (domType === 1 || domType === 3) {
						nextNode = node;
						const needToAdoptContent = !vnode.children.length;
						for (let i = 0; i < vnode.staticCount; i++) {
							if (needToAdoptContent) vnode.children += nextNode.nodeType === 1 ? nextNode.outerHTML : nextNode.data;
							if (i === vnode.staticCount - 1) vnode.anchor = nextNode;
							nextNode = nextSibling(nextNode);
						}
						return isFragmentStart ? nextSibling(nextNode) : nextNode;
					} else onMismatch();
					break;
				case Fragment:
					if (!isFragmentStart) nextNode = onMismatch();
					else nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
					break;
				default: if (shapeFlag & 1) if ((domType !== 1 || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) && !isTemplateNode(node)) nextNode = onMismatch();
				else nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
				else if (shapeFlag & 6) {
					vnode.slotScopeIds = slotScopeIds;
					const container = parentNode(node);
					if (isFragmentStart) nextNode = locateClosingAnchor(node);
					else if (isComment(node) && node.data === "teleport start") nextNode = locateClosingAnchor(node, node.data, "teleport end");
					else nextNode = nextSibling(node);
					mountComponent(vnode, container, null, parentComponent, parentSuspense, getContainerType(container), optimized);
					if (isAsyncWrapper(vnode) && !vnode.type.__asyncResolved) {
						let subTree;
						if (isFragmentStart) {
							subTree = createVNode(Fragment);
							subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
						} else subTree = node.nodeType === 3 ? createTextVNode("") : createVNode("div");
						subTree.el = node;
						vnode.component.subTree = subTree;
					}
				} else if (shapeFlag & 64) if (domType !== 8) nextNode = onMismatch();
				else nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, rendererInternals, hydrateChildren);
				else if (shapeFlag & 128) nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, getContainerType(parentNode(node)), slotScopeIds, optimized, rendererInternals, hydrateNode);
			}
			if (ref != null) setRef(ref, null, parentSuspense, vnode);
			return nextNode;
		};
		const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
			optimized = optimized || !!vnode.dynamicChildren;
			const { type, props, patchFlag, shapeFlag, dirs, transition } = vnode;
			const forcePatch = type === "input" || type === "option";
			if (forcePatch || patchFlag !== -1) {
				if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
				let needCallTransitionHooks = false;
				if (isTemplateNode(el)) {
					needCallTransitionHooks = needTransition(null, transition) && parentComponent && parentComponent.vnode.props && parentComponent.vnode.props.appear;
					const content = el.content.firstChild;
					if (needCallTransitionHooks) {
						const cls = content.getAttribute("class");
						if (cls) content.$cls = cls;
						transition.beforeEnter(content);
					}
					replaceNode(content, el, parentComponent);
					vnode.el = el = content;
				}
				if (shapeFlag & 16 && !(props && (props.innerHTML || props.textContent))) {
					let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, slotScopeIds, optimized);
					while (next) {
						if (!isMismatchAllowed(el, 1)) logMismatchError();
						const cur = next;
						next = next.nextSibling;
						remove(cur);
					}
				} else if (shapeFlag & 8) {
					let clientText = vnode.children;
					if (clientText[0] === "\n" && (el.tagName === "PRE" || el.tagName === "TEXTAREA")) clientText = clientText.slice(1);
					const { textContent } = el;
					if (textContent !== clientText && textContent !== clientText.replace(/\r\n|\r/g, "\n")) {
						if (!isMismatchAllowed(el, 0)) logMismatchError();
						el.textContent = vnode.children;
					}
				}
				if (props) {
					if (forcePatch || !optimized || patchFlag & 48) {
						const isCustomElement = el.tagName.includes("-");
						for (const key in props) if (forcePatch && (key.endsWith("value") || key === "indeterminate") || isOn(key) && !isReservedProp(key) || key[0] === "." || isCustomElement && !isReservedProp(key)) patchProp(el, key, null, props[key], void 0, parentComponent);
					} else if (props.onClick) patchProp(el, "onClick", null, props.onClick, void 0, parentComponent);
					else if (patchFlag & 4 && /* @__PURE__ */ isReactive(props.style)) for (const key in props.style) props.style[key];
				}
				let vnodeHooks;
				if (vnodeHooks = props && props.onVnodeBeforeMount) invokeVNodeHook(vnodeHooks, parentComponent, vnode);
				if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
				if ((vnodeHooks = props && props.onVnodeMounted) || dirs || needCallTransitionHooks) queueEffectWithSuspense(() => {
					vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
					needCallTransitionHooks && transition.enter(el);
					dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
				}, parentSuspense);
			}
			return el.nextSibling;
		};
		const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
			optimized = optimized || !!parentVNode.dynamicChildren;
			const children = parentVNode.children;
			const l = children.length;
			for (let i = 0; i < l; i++) {
				const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
				const isText = vnode.type === Text;
				if (node) {
					if (isText && !optimized) {
						if (i + 1 < l && normalizeVNode(children[i + 1]).type === Text) {
							insert(createText(node.data.slice(vnode.children.length)), container, nextSibling(node));
							node.data = vnode.children;
						}
					}
					node = hydrateNode(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
				} else if (isText && !vnode.children) insert(vnode.el = createText(""), container);
				else {
					if (!isMismatchAllowed(container, 1)) logMismatchError();
					patch(null, vnode, container, null, parentComponent, parentSuspense, getContainerType(container), slotScopeIds);
				}
			}
			return node;
		};
		const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
			const { slotScopeIds: fragmentSlotScopeIds } = vnode;
			if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
			const container = parentNode(node);
			const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, slotScopeIds, optimized);
			if (next && isComment(next) && next.data === "]") return nextSibling(vnode.anchor = next);
			else {
				logMismatchError();
				insert(vnode.anchor = createComment(`]`), container, next);
				return next;
			}
		};
		const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
			if (!isMismatchAllowed(node.parentElement, 1)) logMismatchError();
			vnode.el = null;
			if (isFragment) {
				const end = locateClosingAnchor(node);
				while (true) {
					const next2 = nextSibling(node);
					if (next2 && next2 !== end) remove(next2);
					else break;
				}
			}
			const next = nextSibling(node);
			const container = parentNode(node);
			remove(node);
			patch(null, vnode, container, next, parentComponent, parentSuspense, getContainerType(container), slotScopeIds);
			if (parentComponent) {
				parentComponent.vnode.el = vnode.el;
				updateHOCHostEl(parentComponent, vnode.el);
			}
			return next;
		};
		const locateClosingAnchor = (node, open = "[", close = "]") => {
			let match = 0;
			while (node) {
				node = nextSibling(node);
				if (node && isComment(node)) {
					if (node.data === open) match++;
					if (node.data === close) if (match === 0) return nextSibling(node);
					else match--;
				}
			}
			return node;
		};
		const replaceNode = (newNode, oldNode, parentComponent) => {
			const parentNode2 = oldNode.parentNode;
			if (parentNode2) parentNode2.replaceChild(newNode, oldNode);
			let parent = parentComponent;
			while (parent) {
				if (parent.vnode.el === oldNode) parent.vnode.el = parent.subTree.el = newNode;
				parent = parent.parent;
			}
		};
		const isTemplateNode = (node) => {
			return node.nodeType === 1 && node.tagName === "TEMPLATE";
		};
		return [hydrate, hydrateNode];
	}
	var allowMismatchAttr = "data-allow-mismatch";
	var MismatchTypeString = {
		[0]: "text",
		[1]: "children",
		[2]: "class",
		[3]: "style",
		[4]: "attribute"
	};
	function isMismatchAllowed(el, allowedType) {
		if (allowedType === 0 || allowedType === 1) while (el && !el.hasAttribute(allowMismatchAttr)) el = el.parentElement;
		const allowedAttr = el && el.getAttribute(allowMismatchAttr);
		if (allowedAttr == null) return false;
		else if (allowedAttr === "") return true;
		else {
			const list = allowedAttr.split(",");
			if (allowedType === 0 && list.includes("children")) return true;
			return list.includes(MismatchTypeString[allowedType]);
		}
	}
	var requestIdleCallback = getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
	var cancelIdleCallback = getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
	var hydrateOnIdle = (timeout = 1e4) => (hydrate) => {
		const id = requestIdleCallback(hydrate, { timeout });
		return () => cancelIdleCallback(id);
	};
	function elementIsVisibleInViewport(el) {
		const { top, left, bottom, right } = el.getBoundingClientRect();
		const { innerHeight, innerWidth } = window;
		return (top > 0 && top < innerHeight || bottom > 0 && bottom < innerHeight) && (left > 0 && left < innerWidth || right > 0 && right < innerWidth);
	}
	var hydrateOnVisible = (opts) => (hydrate, forEach) => {
		const ob = new IntersectionObserver((entries) => {
			for (const e of entries) {
				if (!e.isIntersecting) continue;
				ob.disconnect();
				hydrate();
				break;
			}
		}, opts);
		forEach((el) => {
			if (!(el instanceof Element)) return;
			if (elementIsVisibleInViewport(el)) {
				hydrate();
				ob.disconnect();
				return false;
			}
			ob.observe(el);
		});
		return () => ob.disconnect();
	};
	var hydrateOnMediaQuery = (query) => (hydrate) => {
		if (query) {
			const mql = matchMedia(query);
			if (mql.matches) hydrate();
			else {
				mql.addEventListener("change", hydrate, { once: true });
				return () => mql.removeEventListener("change", hydrate);
			}
		}
	};
	var hydrateOnInteraction = (interactions = []) => (hydrate, forEach) => {
		if (isString(interactions)) interactions = [interactions];
		let hasHydrated = false;
		const doHydrate = (e) => {
			if (!hasHydrated) {
				hasHydrated = true;
				teardown();
				hydrate();
				e.target.dispatchEvent(new e.constructor(e.type, e));
			}
		};
		const teardown = () => {
			forEach((el) => {
				for (const i of interactions) el.removeEventListener(i, doHydrate);
			});
		};
		forEach((el) => {
			for (const i of interactions) el.addEventListener(i, doHydrate, { once: true });
		});
		return teardown;
	};
	function forEachElement(node, cb) {
		if (isComment(node) && node.data === "[") {
			let depth = 1;
			let next = node.nextSibling;
			while (next) {
				if (next.nodeType === 1) {
					if (cb(next) === false) break;
				} else if (isComment(next)) {
					if (next.data === "]") {
						if (--depth === 0) break;
					} else if (next.data === "[") depth++;
				}
				next = next.nextSibling;
			}
		} else cb(node);
	}
	var isAsyncWrapper = (i) => !!i.type.__asyncLoader;
	/* @__NO_SIDE_EFFECTS__ */
	function defineAsyncComponent(source) {
		if (isFunction(source)) source = { loader: source };
		const { loader, loadingComponent, errorComponent, delay = 200, hydrate: hydrateStrategy, timeout, suspensible = true, onError: userOnError } = source;
		let pendingRequest = null;
		let resolvedComp;
		let retries = 0;
		const retry = () => {
			retries++;
			pendingRequest = null;
			return load();
		};
		const load = () => {
			let thisRequest;
			return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
				err = err instanceof Error ? err : new Error(String(err));
				if (userOnError) return new Promise((resolve, reject) => {
					const userRetry = () => resolve(retry());
					const userFail = () => reject(err);
					userOnError(err, userRetry, userFail, retries + 1);
				});
				else throw err;
			}).then((comp) => {
				if (thisRequest !== pendingRequest && pendingRequest) return pendingRequest;
				if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) comp = comp.default;
				resolvedComp = comp;
				return comp;
			}));
		};
		return /* @__PURE__ */ defineComponent({
			name: "AsyncComponentWrapper",
			__asyncLoader: load,
			__asyncHydrate(el, instance, hydrate) {
				let patched = false;
				(instance.bu || (instance.bu = [])).push(() => patched = true);
				const performHydrate = () => {
					if (patched) return;
					hydrate();
				};
				const doHydrate = hydrateStrategy ? () => {
					const teardown = hydrateStrategy(performHydrate, (cb) => forEachElement(el, cb));
					if (teardown) (instance.bum || (instance.bum = [])).push(teardown);
				} : performHydrate;
				if (resolvedComp) doHydrate();
				else load().then(() => !instance.isUnmounted && doHydrate());
			},
			get __asyncResolved() {
				return resolvedComp;
			},
			setup() {
				const instance = currentInstance;
				markAsyncBoundary(instance);
				if (resolvedComp) return () => createInnerComp(resolvedComp, instance);
				const onError = (err) => {
					pendingRequest = null;
					handleError(err, instance, 13, !errorComponent);
				};
				if (suspensible && instance.suspense || isInSSRComponentSetup) return load().then((comp) => {
					return () => createInnerComp(comp, instance);
				}).catch((err) => {
					onError(err);
					return () => errorComponent ? createVNode(errorComponent, { error: err }) : null;
				});
				const loaded = /* @__PURE__ */ ref(false);
				const error = /* @__PURE__ */ ref();
				const delayed = /* @__PURE__ */ ref(!!delay);
				if (delay) setTimeout(() => {
					delayed.value = false;
				}, delay);
				if (timeout != null) setTimeout(() => {
					if (!loaded.value && !error.value) {
						const err = /* @__PURE__ */ new Error(`Async component timed out after ${timeout}ms.`);
						onError(err);
						error.value = err;
					}
				}, timeout);
				load().then(() => {
					loaded.value = true;
					if (instance.parent && isKeepAlive(instance.parent.vnode)) instance.parent.update();
				}).catch((err) => {
					onError(err);
					error.value = err;
				});
				return () => {
					if (loaded.value && resolvedComp) return createInnerComp(resolvedComp, instance);
					else if (error.value && errorComponent) return createVNode(errorComponent, { error: error.value });
					else if (loadingComponent && !delayed.value) return createInnerComp(loadingComponent, instance);
				};
			}
		});
	}
	function createInnerComp(comp, parent) {
		const { ref: ref2, props, children, ce } = parent.vnode;
		const vnode = createVNode(comp, props, children);
		vnode.ref = ref2;
		vnode.ce = ce;
		delete parent.vnode.ce;
		return vnode;
	}
	var isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
	var KeepAlive = {
		name: `KeepAlive`,
		__isKeepAlive: true,
		props: {
			include: [
				String,
				RegExp,
				Array
			],
			exclude: [
				String,
				RegExp,
				Array
			],
			max: [String, Number]
		},
		setup(props, { slots }) {
			const instance = getCurrentInstance();
			const sharedContext = instance.ctx;
			if (!sharedContext.renderer) return () => {
				const children = slots.default && slots.default();
				return children && children.length === 1 ? children[0] : children;
			};
			const cache = /* @__PURE__ */ new Map();
			const keys = /* @__PURE__ */ new Set();
			let current = null;
			const parentSuspense = instance.suspense;
			const { renderer: { p: patch, m: move, um: _unmount, o: { createElement } } } = sharedContext;
			const storageContainer = createElement("div");
			sharedContext.activate = (vnode, container, anchor, namespace, optimized) => {
				const instance2 = vnode.component;
				move(vnode, container, anchor, 0, parentSuspense);
				patch(instance2.vnode, vnode, container, anchor, instance2, parentSuspense, namespace, vnode.slotScopeIds, optimized);
				queuePostRenderEffect(() => {
					instance2.isDeactivated = false;
					if (instance2.a) invokeArrayFns(instance2.a);
					const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
					if (vnodeHook) invokeVNodeHook(vnodeHook, instance2.parent, vnode);
				}, parentSuspense);
			};
			sharedContext.deactivate = (vnode) => {
				const instance2 = vnode.component;
				invalidateMount(instance2.m);
				invalidateMount(instance2.a);
				move(vnode, storageContainer, null, 1, parentSuspense);
				queuePostRenderEffect(() => {
					if (instance2.da) invokeArrayFns(instance2.da);
					const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
					if (vnodeHook) invokeVNodeHook(vnodeHook, instance2.parent, vnode);
					instance2.isDeactivated = true;
				}, parentSuspense);
			};
			function unmount(vnode) {
				resetShapeFlag(vnode);
				_unmount(vnode, instance, parentSuspense, true);
			}
			function pruneCache(filter) {
				cache.forEach((vnode, key) => {
					const name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : vnode.type);
					if (name && !filter(name)) pruneCacheEntry(key);
				});
			}
			function pruneCacheEntry(key) {
				const cached = cache.get(key);
				if (cached && (!current || !isSameVNodeType(cached, current))) unmount(cached);
				else if (current) resetShapeFlag(current);
				cache.delete(key);
				keys.delete(key);
			}
			watch(() => [props.include, props.exclude], ([include, exclude]) => {
				include && pruneCache((name) => matches(include, name));
				exclude && pruneCache((name) => !matches(exclude, name));
			}, {
				flush: "post",
				deep: true
			});
			let pendingCacheKey = null;
			const cacheSubtree = () => {
				if (pendingCacheKey != null) if (isSuspense(instance.subTree.type)) queuePostRenderEffect(() => {
					cache.set(pendingCacheKey, getInnerChild(instance.subTree));
				}, instance.subTree.suspense);
				else cache.set(pendingCacheKey, getInnerChild(instance.subTree));
			};
			onMounted(cacheSubtree);
			onUpdated(cacheSubtree);
			onBeforeUnmount(() => {
				cache.forEach((cached) => {
					const { subTree, suspense } = instance;
					const vnode = getInnerChild(subTree);
					if (cached.type === vnode.type && cached.key === vnode.key) {
						resetShapeFlag(vnode);
						const da = vnode.component.da;
						da && queuePostRenderEffect(da, suspense);
						return;
					}
					unmount(cached);
				});
			});
			return () => {
				pendingCacheKey = null;
				if (!slots.default) return current = null;
				const children = slots.default();
				const rawVNode = children[0];
				if (children.length > 1) {
					current = null;
					return children;
				} else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128)) {
					current = null;
					return rawVNode;
				}
				let vnode = getInnerChild(rawVNode);
				if (vnode.type === Comment) {
					current = null;
					return vnode;
				}
				const comp = vnode.type;
				const name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp);
				const { include, exclude, max } = props;
				if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
					vnode.shapeFlag &= -257;
					current = vnode;
					return rawVNode;
				}
				const key = vnode.key == null ? comp : vnode.key;
				const cachedVNode = cache.get(key);
				if (vnode.el) {
					vnode = cloneVNode(vnode);
					if (rawVNode.shapeFlag & 128) rawVNode.ssContent = vnode;
				}
				pendingCacheKey = key;
				if (cachedVNode) {
					vnode.el = cachedVNode.el;
					vnode.component = cachedVNode.component;
					if (vnode.transition) setTransitionHooks(vnode, vnode.transition);
					vnode.shapeFlag |= 512;
					keys.delete(key);
					keys.add(key);
				} else {
					keys.add(key);
					if (max && keys.size > parseInt(max, 10)) pruneCacheEntry(keys.values().next().value);
				}
				vnode.shapeFlag |= 256;
				current = vnode;
				return isSuspense(rawVNode.type) ? rawVNode : vnode;
			};
		}
	};
	function matches(pattern, name) {
		if (isArray(pattern)) return pattern.some((p) => matches(p, name));
		else if (isString(pattern)) return pattern.split(",").includes(name);
		else if (isRegExp(pattern)) {
			pattern.lastIndex = 0;
			return pattern.test(name);
		}
		return false;
	}
	function onActivated(hook, target) {
		registerKeepAliveHook(hook, "a", target);
	}
	function onDeactivated(hook, target) {
		registerKeepAliveHook(hook, "da", target);
	}
	function registerKeepAliveHook(hook, type, target = currentInstance) {
		const wrappedHook = hook.__wdc || (hook.__wdc = () => {
			let current = target;
			while (current) {
				if (current.isDeactivated) return;
				current = current.parent;
			}
			return hook();
		});
		injectHook(type, wrappedHook, target);
		if (target) {
			let current = target.parent;
			while (current && current.parent) {
				if (isKeepAlive(current.parent.vnode)) injectToKeepAliveRoot(wrappedHook, type, target, current);
				current = current.parent;
			}
		}
	}
	function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
		const injected = injectHook(type, hook, keepAliveRoot, true);
		onUnmounted(() => {
			remove(keepAliveRoot[type], injected);
		}, target);
	}
	function resetShapeFlag(vnode) {
		vnode.shapeFlag &= -257;
		vnode.shapeFlag &= -513;
	}
	function getInnerChild(vnode) {
		return vnode.shapeFlag & 128 ? vnode.ssContent : vnode;
	}
	function injectHook(type, hook, target = currentInstance, prepend = false) {
		if (target) {
			const hooks = target[type] || (target[type] = []);
			const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
				pauseTracking();
				const reset = setCurrentInstance(target);
				const res = callWithAsyncErrorHandling(hook, target, type, args);
				reset();
				resetTracking();
				return res;
			});
			if (prepend) hooks.unshift(wrappedHook);
			else hooks.push(wrappedHook);
			return wrappedHook;
		}
	}
	var createHook = (lifecycle) => (hook, target = currentInstance) => {
		if (!isInSSRComponentSetup || lifecycle === "sp") injectHook(lifecycle, (...args) => hook(...args), target);
	};
	var onBeforeMount = createHook("bm");
	var onMounted = createHook("m");
	var onBeforeUpdate = createHook("bu");
	var onUpdated = createHook("u");
	var onBeforeUnmount = createHook("bum");
	var onUnmounted = createHook("um");
	var onServerPrefetch = createHook("sp");
	var onRenderTriggered = createHook("rtg");
	var onRenderTracked = createHook("rtc");
	function onErrorCaptured(hook, target = currentInstance) {
		injectHook("ec", hook, target);
	}
	var COMPONENTS = "components";
	var DIRECTIVES = "directives";
	function resolveComponent(name, maybeSelfReference) {
		return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
	}
	var NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
	function resolveDynamicComponent(component) {
		if (isString(component)) return resolveAsset(COMPONENTS, component, false) || component;
		else return component || NULL_DYNAMIC_COMPONENT;
	}
	function resolveDirective(name) {
		return resolveAsset(DIRECTIVES, name);
	}
	function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
		const instance = currentRenderingInstance || currentInstance;
		if (instance) {
			const Component = instance.type;
			if (type === COMPONENTS) {
				const selfName = getComponentName(Component, false);
				if (selfName && (selfName === name || selfName === camelize$1(name) || selfName === capitalize(camelize$1(name)))) return Component;
			}
			const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
			if (!res && maybeSelfReference) return Component;
			return res;
		}
	}
	function resolve(registry, name) {
		return registry && (registry[name] || registry[camelize$1(name)] || registry[capitalize(camelize$1(name))]);
	}
	function renderList(source, renderItem, cache, index) {
		let ret;
		const cached = cache && cache[index];
		const sourceIsArray = isArray(source);
		if (sourceIsArray || isString(source)) {
			const sourceIsReactiveArray = sourceIsArray && /* @__PURE__ */ isReactive(source);
			let needsWrap = false;
			let isReadonlySource = false;
			if (sourceIsReactiveArray) {
				needsWrap = !/* @__PURE__ */ isShallow(source);
				isReadonlySource = /* @__PURE__ */ isReadonly(source);
				source = shallowReadArray(source);
			}
			ret = new Array(source.length);
			for (let i = 0, l = source.length; i < l; i++) ret[i] = renderItem(needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i], i, void 0, cached && cached[i]);
		} else if (typeof source === "number") {
			ret = new Array(source);
			for (let i = 0; i < source; i++) ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
		} else if (isObject$1(source)) if (source[Symbol.iterator]) ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
		else {
			const keys = Object.keys(source);
			ret = new Array(keys.length);
			for (let i = 0, l = keys.length; i < l; i++) {
				const key = keys[i];
				ret[i] = renderItem(source[key], key, i, cached && cached[i]);
			}
		}
		else ret = [];
		if (cache) cache[index] = ret;
		return ret;
	}
	function createSlots(slots, dynamicSlots) {
		for (let i = 0; i < dynamicSlots.length; i++) {
			const slot = dynamicSlots[i];
			if (isArray(slot)) for (let j = 0; j < slot.length; j++) slots[slot[j].name] = slot[j].fn;
			else if (slot) slots[slot.name] = slot.key ? (...args) => {
				const res = slot.fn(...args);
				if (res) res.key = slot.key;
				return res;
			} : slot.fn;
		}
		return slots;
	}
	function renderSlot(slots, name, props = {}, fallback, noSlotted) {
		if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
			const hasProps = Object.keys(props).length > 0;
			if (name !== "default") props.name = name;
			return openBlock(), createBlock(Fragment, null, [createVNode("slot", props, fallback && fallback())], hasProps ? -2 : 64);
		}
		let slot = slots[name];
		if (slot && slot._c) slot._d = false;
		openBlock();
		const validSlotContent = slot && ensureValidVNode(slot(props));
		const slotKey = props.key || validSlotContent && validSlotContent.key;
		const rendered = createBlock(Fragment, { key: (slotKey && !isSymbol(slotKey) ? slotKey : `_${name}`) + (!validSlotContent && fallback ? "_fb" : "") }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
		if (!noSlotted && rendered.scopeId) rendered.slotScopeIds = [rendered.scopeId + "-s"];
		if (slot && slot._c) slot._d = true;
		return rendered;
	}
	function ensureValidVNode(vnodes) {
		return vnodes.some((child) => {
			if (!isVNode(child)) return true;
			if (child.type === Comment) return false;
			if (child.type === Fragment && !ensureValidVNode(child.children)) return false;
			return true;
		}) ? vnodes : null;
	}
	function toHandlers(obj, preserveCaseIfNecessary) {
		const ret = {};
		for (const key in obj) ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
		return ret;
	}
	var getPublicInstance = (i) => {
		if (!i) return null;
		if (isStatefulComponent(i)) return getComponentPublicInstance(i);
		return getPublicInstance(i.parent);
	};
	var publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
		$: (i) => i,
		$el: (i) => i.vnode.el,
		$data: (i) => i.data,
		$props: (i) => i.props,
		$attrs: (i) => i.attrs,
		$slots: (i) => i.slots,
		$refs: (i) => i.refs,
		$parent: (i) => getPublicInstance(i.parent),
		$root: (i) => getPublicInstance(i.root),
		$host: (i) => i.ce,
		$emit: (i) => i.emit,
		$options: (i) => resolveMergedOptions(i),
		$forceUpdate: (i) => i.f || (i.f = () => {
			queueJob(i.update);
		}),
		$nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
		$watch: (i) => instanceWatch.bind(i)
	});
	var hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
	var PublicInstanceProxyHandlers = {
		get({ _: instance }, key) {
			if (key === "__v_skip") return true;
			const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
			if (key[0] !== "$") {
				const n = accessCache[key];
				if (n !== void 0) switch (n) {
					case 1: return setupState[key];
					case 2: return data[key];
					case 4: return ctx[key];
					case 3: return props[key];
				}
				else if (hasSetupBinding(setupState, key)) {
					accessCache[key] = 1;
					return setupState[key];
				} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
					accessCache[key] = 2;
					return data[key];
				} else if (hasOwn(props, key)) {
					accessCache[key] = 3;
					return props[key];
				} else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
					accessCache[key] = 4;
					return ctx[key];
				} else if (shouldCacheAccess) accessCache[key] = 0;
			}
			const publicGetter = publicPropertiesMap[key];
			let cssModule, globalProperties;
			if (publicGetter) {
				if (key === "$attrs") track(instance.attrs, "get", "");
				return publicGetter(instance);
			} else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) return cssModule;
			else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
				accessCache[key] = 4;
				return ctx[key];
			} else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) return globalProperties[key];
		},
		set({ _: instance }, key, value) {
			const { data, setupState, ctx } = instance;
			if (hasSetupBinding(setupState, key)) {
				setupState[key] = value;
				return true;
			} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
				data[key] = value;
				return true;
			} else if (hasOwn(instance.props, key)) return false;
			if (key[0] === "$" && key.slice(1) in instance) return false;
			else ctx[key] = value;
			return true;
		},
		has({ _: { data, setupState, accessCache, ctx, appContext, props, type } }, key) {
			let cssModules;
			return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
		},
		defineProperty(target, key, descriptor) {
			if (descriptor.get != null) target._.accessCache[key] = 0;
			else if (hasOwn(descriptor, "value")) this.set(target, key, descriptor.value, null);
			return Reflect.defineProperty(target, key, descriptor);
		}
	};
	var RuntimeCompiledPublicInstanceProxyHandlers = /* @__PURE__ */ extend({}, PublicInstanceProxyHandlers, {
		get(target, key) {
			if (key === Symbol.unscopables) return;
			return PublicInstanceProxyHandlers.get(target, key, target);
		},
		has(_, key) {
			return key[0] !== "_" && !isGloballyAllowed(key);
		}
	});
	function defineProps() {
		return null;
	}
	function defineEmits() {
		return null;
	}
	function defineExpose(exposed) {}
	function defineOptions(options) {}
	function defineSlots() {
		return null;
	}
	function defineModel() {}
	function withDefaults(props, defaults) {
		return null;
	}
	function useSlots() {
		return getContext("useSlots").slots;
	}
	function useAttrs() {
		return getContext("useAttrs").attrs;
	}
	function getContext(calledFunctionName) {
		const i = getCurrentInstance();
		return i.setupContext || (i.setupContext = createSetupContext(i));
	}
	function normalizePropsOrEmits(props) {
		return isArray(props) ? props.reduce((normalized, p) => (normalized[p] = null, normalized), {}) : props;
	}
	function mergeDefaults(raw, defaults) {
		const props = normalizePropsOrEmits(raw);
		for (const key in defaults) {
			if (key.startsWith("__skip")) continue;
			let opt = props[key];
			if (opt) if (isArray(opt) || isFunction(opt)) opt = props[key] = {
				type: opt,
				default: defaults[key]
			};
			else opt.default = defaults[key];
			else if (opt === null) opt = props[key] = { default: defaults[key] };
			if (opt && defaults[`__skip_${key}`]) opt.skipFactory = true;
		}
		return props;
	}
	function mergeModels(a, b) {
		if (!a || !b) return a || b;
		if (isArray(a) && isArray(b)) return a.concat(b);
		return extend({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
	}
	function createPropsRestProxy(props, excludedKeys) {
		const ret = {};
		for (const key in props) if (!excludedKeys.includes(key)) Object.defineProperty(ret, key, {
			enumerable: true,
			get: () => props[key]
		});
		return ret;
	}
	function withAsyncContext(getAwaitable) {
		const ctx = getCurrentInstance();
		const inSSRSetup = isInSSRComponentSetup;
		let awaitable = getAwaitable();
		unsetCurrentInstance();
		if (inSSRSetup) setInSSRSetupState(false);
		const restore = () => {
			setCurrentInstance(ctx);
			if (inSSRSetup) setInSSRSetupState(true);
		};
		const cleanup = () => {
			if (getCurrentInstance() !== ctx) ctx.scope.off();
			unsetCurrentInstance();
			if (inSSRSetup) setInSSRSetupState(false);
		};
		if (isPromise(awaitable)) awaitable = awaitable.catch((e) => {
			restore();
			Promise.resolve().then(() => Promise.resolve().then(cleanup));
			throw e;
		});
		return [awaitable, () => {
			restore();
			Promise.resolve().then(cleanup);
		}];
	}
	var shouldCacheAccess = true;
	function applyOptions(instance) {
		const options = resolveMergedOptions(instance);
		const publicThis = instance.proxy;
		const ctx = instance.ctx;
		shouldCacheAccess = false;
		if (options.beforeCreate) callHook$1(options.beforeCreate, instance, "bc");
		const { data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, created, beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeDestroy, beforeUnmount, destroyed, unmounted, render, renderTracked, renderTriggered, errorCaptured, serverPrefetch, expose, inheritAttrs, components, directives, filters } = options;
		const checkDuplicateProperties = null;
		if (injectOptions) resolveInjections(injectOptions, ctx, checkDuplicateProperties);
		if (methods) for (const key in methods) {
			const methodHandler = methods[key];
			if (isFunction(methodHandler)) ctx[key] = methodHandler.bind(publicThis);
		}
		if (dataOptions) {
			const data = dataOptions.call(publicThis, publicThis);
			if (!isObject$1(data)) {} else instance.data = /* @__PURE__ */ reactive(data);
		}
		shouldCacheAccess = true;
		if (computedOptions) for (const key in computedOptions) {
			const opt = computedOptions[key];
			const c = computed({
				get: isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP,
				set: !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP
			});
			Object.defineProperty(ctx, key, {
				enumerable: true,
				configurable: true,
				get: () => c.value,
				set: (v) => c.value = v
			});
		}
		if (watchOptions) for (const key in watchOptions) createWatcher(watchOptions[key], ctx, publicThis, key);
		if (provideOptions) {
			const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
			Reflect.ownKeys(provides).forEach((key) => {
				provide(key, provides[key]);
			});
		}
		if (created) callHook$1(created, instance, "c");
		function registerLifecycleHook(register, hook) {
			if (isArray(hook)) hook.forEach((_hook) => register(_hook.bind(publicThis)));
			else if (hook) register(hook.bind(publicThis));
		}
		registerLifecycleHook(onBeforeMount, beforeMount);
		registerLifecycleHook(onMounted, mounted);
		registerLifecycleHook(onBeforeUpdate, beforeUpdate);
		registerLifecycleHook(onUpdated, updated);
		registerLifecycleHook(onActivated, activated);
		registerLifecycleHook(onDeactivated, deactivated);
		registerLifecycleHook(onErrorCaptured, errorCaptured);
		registerLifecycleHook(onRenderTracked, renderTracked);
		registerLifecycleHook(onRenderTriggered, renderTriggered);
		registerLifecycleHook(onBeforeUnmount, beforeUnmount);
		registerLifecycleHook(onUnmounted, unmounted);
		registerLifecycleHook(onServerPrefetch, serverPrefetch);
		if (isArray(expose)) {
			if (expose.length) {
				const exposed = instance.exposed || (instance.exposed = {});
				expose.forEach((key) => {
					Object.defineProperty(exposed, key, {
						get: () => publicThis[key],
						set: (val) => publicThis[key] = val,
						enumerable: true
					});
				});
			} else if (!instance.exposed) instance.exposed = {};
		}
		if (render && instance.render === NOOP) instance.render = render;
		if (inheritAttrs != null) instance.inheritAttrs = inheritAttrs;
		if (components) instance.components = components;
		if (directives) instance.directives = directives;
		if (serverPrefetch) markAsyncBoundary(instance);
	}
	function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
		if (isArray(injectOptions)) injectOptions = normalizeInject(injectOptions);
		for (const key in injectOptions) {
			const opt = injectOptions[key];
			let injected;
			if (isObject$1(opt)) if ("default" in opt) injected = inject(opt.from || key, opt.default, true);
			else injected = inject(opt.from || key);
			else injected = inject(opt);
			if (/* @__PURE__ */ isRef(injected)) Object.defineProperty(ctx, key, {
				enumerable: true,
				configurable: true,
				get: () => injected.value,
				set: (v) => injected.value = v
			});
			else ctx[key] = injected;
		}
	}
	function callHook$1(hook, instance, type) {
		callWithAsyncErrorHandling(isArray(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
	}
	function createWatcher(raw, ctx, publicThis, key) {
		let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
		if (isString(raw)) {
			const handler = ctx[raw];
			if (isFunction(handler)) watch(getter, handler);
		} else if (isFunction(raw)) watch(getter, raw.bind(publicThis));
		else if (isObject$1(raw)) if (isArray(raw)) raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
		else {
			const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
			if (isFunction(handler)) watch(getter, handler, raw);
		}
	}
	function resolveMergedOptions(instance) {
		const base = instance.type;
		const { mixins, extends: extendsOptions } = base;
		const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
		const cached = cache.get(base);
		let resolved;
		if (cached) resolved = cached;
		else if (!globalMixins.length && !mixins && !extendsOptions) resolved = base;
		else {
			resolved = {};
			if (globalMixins.length) globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
			mergeOptions(resolved, base, optionMergeStrategies);
		}
		if (isObject$1(base)) cache.set(base, resolved);
		return resolved;
	}
	function mergeOptions(to, from, strats, asMixin = false) {
		const { mixins, extends: extendsOptions } = from;
		if (extendsOptions) mergeOptions(to, extendsOptions, strats, true);
		if (mixins) mixins.forEach((m) => mergeOptions(to, m, strats, true));
		for (const key in from) if (asMixin && key === "expose") {} else {
			const strat = internalOptionMergeStrats[key] || strats && strats[key];
			to[key] = strat ? strat(to[key], from[key]) : from[key];
		}
		return to;
	}
	var internalOptionMergeStrats = {
		data: mergeDataFn,
		props: mergeEmitsOrPropsOptions,
		emits: mergeEmitsOrPropsOptions,
		methods: mergeObjectOptions,
		computed: mergeObjectOptions,
		beforeCreate: mergeAsArray,
		created: mergeAsArray,
		beforeMount: mergeAsArray,
		mounted: mergeAsArray,
		beforeUpdate: mergeAsArray,
		updated: mergeAsArray,
		beforeDestroy: mergeAsArray,
		beforeUnmount: mergeAsArray,
		destroyed: mergeAsArray,
		unmounted: mergeAsArray,
		activated: mergeAsArray,
		deactivated: mergeAsArray,
		errorCaptured: mergeAsArray,
		serverPrefetch: mergeAsArray,
		components: mergeObjectOptions,
		directives: mergeObjectOptions,
		watch: mergeWatchOptions,
		provide: mergeDataFn,
		inject: mergeInject
	};
	function mergeDataFn(to, from) {
		if (!from) return to;
		if (!to) return from;
		return function mergedDataFn() {
			return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
		};
	}
	function mergeInject(to, from) {
		return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
	}
	function normalizeInject(raw) {
		if (isArray(raw)) {
			const res = {};
			for (let i = 0; i < raw.length; i++) res[raw[i]] = raw[i];
			return res;
		}
		return raw;
	}
	function mergeAsArray(to, from) {
		return to ? [...new Set([].concat(to, from))] : from;
	}
	function mergeObjectOptions(to, from) {
		return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
	}
	function mergeEmitsOrPropsOptions(to, from) {
		if (to) {
			if (isArray(to) && isArray(from)) return [.../* @__PURE__ */ new Set([...to, ...from])];
			return extend(/* @__PURE__ */ Object.create(null), normalizePropsOrEmits(to), normalizePropsOrEmits(from != null ? from : {}));
		} else return from;
	}
	function mergeWatchOptions(to, from) {
		if (!to) return from;
		if (!from) return to;
		const merged = extend(/* @__PURE__ */ Object.create(null), to);
		for (const key in from) merged[key] = mergeAsArray(to[key], from[key]);
		return merged;
	}
	function createAppContext() {
		return {
			app: null,
			config: {
				isNativeTag: NO,
				performance: false,
				globalProperties: {},
				optionMergeStrategies: {},
				errorHandler: void 0,
				warnHandler: void 0,
				compilerOptions: {}
			},
			mixins: [],
			components: {},
			directives: {},
			provides: /* @__PURE__ */ Object.create(null),
			optionsCache: /* @__PURE__ */ new WeakMap(),
			propsCache: /* @__PURE__ */ new WeakMap(),
			emitsCache: /* @__PURE__ */ new WeakMap()
		};
	}
	var uid$1 = 0;
	function createAppAPI(render, hydrate) {
		return function createApp(rootComponent, rootProps = null) {
			if (!isFunction(rootComponent)) rootComponent = extend({}, rootComponent);
			if (rootProps != null && !isObject$1(rootProps)) rootProps = null;
			const context = createAppContext();
			const installedPlugins = /* @__PURE__ */ new WeakSet();
			const pluginCleanupFns = [];
			let isMounted = false;
			const app = context.app = {
				_uid: uid$1++,
				_component: rootComponent,
				_props: rootProps,
				_container: null,
				_context: context,
				_instance: null,
				version,
				get config() {
					return context.config;
				},
				set config(v) {},
				use(plugin, ...options) {
					if (installedPlugins.has(plugin)) {} else if (plugin && isFunction(plugin.install)) {
						installedPlugins.add(plugin);
						plugin.install(app, ...options);
					} else if (isFunction(plugin)) {
						installedPlugins.add(plugin);
						plugin(app, ...options);
					}
					return app;
				},
				mixin(mixin) {
					if (!context.mixins.includes(mixin)) context.mixins.push(mixin);
					return app;
				},
				component(name, component) {
					if (!component) return context.components[name];
					context.components[name] = component;
					return app;
				},
				directive(name, directive) {
					if (!directive) return context.directives[name];
					context.directives[name] = directive;
					return app;
				},
				mount(rootContainer, isHydrate, namespace) {
					if (!isMounted) {
						const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
						vnode.appContext = context;
						if (namespace === true) namespace = "svg";
						else if (namespace === false) namespace = void 0;
						if (isHydrate && hydrate) hydrate(vnode, rootContainer);
						else render(vnode, rootContainer, namespace);
						isMounted = true;
						app._container = rootContainer;
						rootContainer.__vue_app__ = app;
						return getComponentPublicInstance(vnode.component);
					}
				},
				onUnmount(cleanupFn) {
					pluginCleanupFns.push(cleanupFn);
				},
				unmount() {
					if (isMounted) {
						callWithAsyncErrorHandling(pluginCleanupFns, app._instance, 16);
						render(null, app._container);
						delete app._container.__vue_app__;
					}
				},
				provide(key, value) {
					context.provides[key] = value;
					return app;
				},
				runWithContext(fn) {
					const lastApp = currentApp;
					currentApp = app;
					try {
						return fn();
					} finally {
						currentApp = lastApp;
					}
				}
			};
			return app;
		};
	}
	var currentApp = null;
	function useModel(props, name, options = EMPTY_OBJ) {
		const i = getCurrentInstance();
		const camelizedName = camelize$1(name);
		const hyphenatedName = hyphenate$1(name);
		const modifiers = getModelModifiers(props, camelizedName);
		const res = customRef((track, trigger) => {
			let localValue;
			let prevSetValue = EMPTY_OBJ;
			let prevEmittedValue;
			watchSyncEffect(() => {
				const propValue = props[camelizedName];
				if (hasChanged(localValue, propValue)) {
					localValue = propValue;
					trigger();
				}
			});
			return {
				get() {
					track();
					return options.get ? options.get(localValue) : localValue;
				},
				set(value) {
					const emittedValue = options.set ? options.set(value) : value;
					if (!hasChanged(emittedValue, localValue) && !(prevSetValue !== EMPTY_OBJ && hasChanged(value, prevSetValue))) return;
					const rawProps = i.vnode.props;
					if (!(rawProps && (name in rawProps || camelizedName in rawProps || hyphenatedName in rawProps) && (`onUpdate:${name}` in rawProps || `onUpdate:${camelizedName}` in rawProps || `onUpdate:${hyphenatedName}` in rawProps))) {
						localValue = value;
						trigger();
					}
					i.emit(`update:${name}`, emittedValue);
					if (hasChanged(value, emittedValue) && hasChanged(value, prevSetValue) && !hasChanged(emittedValue, prevEmittedValue)) trigger();
					prevSetValue = value;
					prevEmittedValue = emittedValue;
				}
			};
		});
		res[Symbol.iterator] = () => {
			let i2 = 0;
			return { next() {
				if (i2 < 2) return {
					value: i2++ ? modifiers || EMPTY_OBJ : res,
					done: false
				};
				else return { done: true };
			} };
		};
		return res;
	}
	var getModelModifiers = (props, modelName) => {
		return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize$1(modelName)}Modifiers`] || props[`${hyphenate$1(modelName)}Modifiers`];
	};
	function emit(instance, event, ...rawArgs) {
		if (instance.isUnmounted) return;
		const props = instance.vnode.props || EMPTY_OBJ;
		let args = rawArgs;
		const isModelListener = event.startsWith("update:");
		const modifiers = isModelListener && getModelModifiers(props, event.slice(7));
		if (modifiers) {
			if (modifiers.trim) args = rawArgs.map((a) => isString(a) ? a.trim() : a);
			if (modifiers.number) args = rawArgs.map(looseToNumber);
		}
		let handlerName;
		let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize$1(event))];
		if (!handler && isModelListener) handler = props[handlerName = toHandlerKey(hyphenate$1(event))];
		if (handler) callWithAsyncErrorHandling(handler, instance, 6, args);
		const onceHandler = props[handlerName + `Once`];
		if (onceHandler) {
			if (!instance.emitted) instance.emitted = {};
			else if (instance.emitted[handlerName]) return;
			instance.emitted[handlerName] = true;
			callWithAsyncErrorHandling(onceHandler, instance, 6, args);
		}
	}
	var mixinEmitsCache = /* @__PURE__ */ new WeakMap();
	function normalizeEmitsOptions(comp, appContext, asMixin = false) {
		const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
		const cached = cache.get(comp);
		if (cached !== void 0) return cached;
		const raw = comp.emits;
		let normalized = {};
		let hasExtends = false;
		if (!isFunction(comp)) {
			const extendEmits = (raw2) => {
				const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
				if (normalizedFromExtend) {
					hasExtends = true;
					extend(normalized, normalizedFromExtend);
				}
			};
			if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendEmits);
			if (comp.extends) extendEmits(comp.extends);
			if (comp.mixins) comp.mixins.forEach(extendEmits);
		}
		if (!raw && !hasExtends) {
			if (isObject$1(comp)) cache.set(comp, null);
			return null;
		}
		if (isArray(raw)) raw.forEach((key) => normalized[key] = null);
		else extend(normalized, raw);
		if (isObject$1(comp)) cache.set(comp, normalized);
		return normalized;
	}
	function isEmitListener(options, key) {
		if (!options || !isOn(key)) return false;
		key = key.slice(2).replace(/Once$/, "");
		return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate$1(key)) || hasOwn(options, key);
	}
	function renderComponentRoot(instance) {
		const { type: Component, vnode, proxy, withProxy, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, props, data, setupState, ctx, inheritAttrs } = instance;
		const prev = setCurrentRenderingInstance(instance);
		let result;
		let fallthroughAttrs;
		try {
			if (vnode.shapeFlag & 4) {
				const proxyToUse = withProxy || proxy;
				const thisProxy = proxyToUse;
				result = normalizeVNode(render.call(thisProxy, proxyToUse, renderCache, props, setupState, data, ctx));
				fallthroughAttrs = attrs;
			} else {
				const render2 = Component;
				result = normalizeVNode(render2.length > 1 ? render2(props, {
					attrs,
					slots,
					emit
				}) : render2(props, null));
				fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
			}
		} catch (err) {
			blockStack.length = 0;
			handleError(err, instance, 1);
			result = createVNode(Comment);
		}
		let root = result;
		if (fallthroughAttrs && inheritAttrs !== false) {
			const keys = Object.keys(fallthroughAttrs);
			const { shapeFlag } = root;
			if (keys.length) {
				if (shapeFlag & 7) {
					if (propsOptions && keys.some(isModelListener)) fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
					root = cloneVNode(root, fallthroughAttrs, false, true);
				}
			}
		}
		if (vnode.dirs) {
			root = cloneVNode(root, null, false, true);
			root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
		}
		if (vnode.transition) setTransitionHooks(root, vnode.transition);
		result = root;
		setCurrentRenderingInstance(prev);
		return result;
	}
	function filterSingleRoot(children, recurse = true) {
		let singleRoot;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (isVNode(child)) {
				if (child.type !== Comment || child.children === "v-if") if (singleRoot) return;
				else singleRoot = child;
			} else return;
		}
		return singleRoot;
	}
	var getFunctionalFallthrough = (attrs) => {
		let res;
		for (const key in attrs) if (key === "class" || key === "style" || isOn(key)) (res || (res = {}))[key] = attrs[key];
		return res;
	};
	var filterModelListeners = (attrs, props) => {
		const res = {};
		for (const key in attrs) if (!isModelListener(key) || !(key.slice(9) in props)) res[key] = attrs[key];
		return res;
	};
	function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
		const { props: prevProps, children: prevChildren, component } = prevVNode;
		const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
		const emits = component.emitsOptions;
		if (nextVNode.dirs || nextVNode.transition) return true;
		if (optimized && patchFlag >= 0) {
			if (patchFlag & 1024) return true;
			if (patchFlag & 16) {
				if (!prevProps) return !!nextProps;
				return hasPropsChanged(prevProps, nextProps, emits);
			} else if (patchFlag & 8) {
				const dynamicProps = nextVNode.dynamicProps;
				for (let i = 0; i < dynamicProps.length; i++) {
					const key = dynamicProps[i];
					if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) return true;
				}
			}
		} else {
			if (prevChildren || nextChildren) {
				if (!nextChildren || !nextChildren.$stable) return true;
			}
			if (prevProps === nextProps) return false;
			if (!prevProps) return !!nextProps;
			if (!nextProps) return true;
			return hasPropsChanged(prevProps, nextProps, emits);
		}
		return false;
	}
	function hasPropsChanged(prevProps, nextProps, emitsOptions) {
		const nextKeys = Object.keys(nextProps);
		if (nextKeys.length !== Object.keys(prevProps).length) return true;
		for (let i = 0; i < nextKeys.length; i++) {
			const key = nextKeys[i];
			if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) return true;
		}
		return false;
	}
	function hasPropValueChanged(nextProps, prevProps, key) {
		const nextProp = nextProps[key];
		const prevProp = prevProps[key];
		if (key === "style" && isObject$1(nextProp) && isObject$1(prevProp)) return !looseEqual(nextProp, prevProp);
		return nextProp !== prevProp;
	}
	function updateHOCHostEl({ vnode, parent, suspense }, el) {
		while (parent) {
			const root = parent.subTree;
			if (root.suspense && root.suspense.activeBranch === vnode) {
				root.suspense.vnode.el = root.el = el;
				vnode = root;
			}
			if (root === vnode) {
				(vnode = parent.vnode).el = el;
				parent = parent.parent;
			} else break;
		}
		if (suspense && suspense.activeBranch === vnode) suspense.vnode.el = el;
	}
	var internalObjectProto = {};
	var createInternalObject = () => Object.create(internalObjectProto);
	var isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
	function initProps(instance, rawProps, isStateful, isSSR = false) {
		const props = {};
		const attrs = createInternalObject();
		instance.propsDefaults = /* @__PURE__ */ Object.create(null);
		setFullProps(instance, rawProps, props, attrs);
		for (const key in instance.propsOptions[0]) if (!(key in props)) props[key] = void 0;
		if (isStateful) instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
		else if (!instance.type.props) instance.props = attrs;
		else instance.props = props;
		instance.attrs = attrs;
	}
	function updateProps(instance, rawProps, rawPrevProps, optimized) {
		const { props, attrs, vnode: { patchFlag } } = instance;
		const rawCurrentProps = /* @__PURE__ */ toRaw(props);
		const [options] = instance.propsOptions;
		let hasAttrsChanged = false;
		if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
			if (patchFlag & 8) {
				const propsToUpdate = instance.vnode.dynamicProps;
				for (let i = 0; i < propsToUpdate.length; i++) {
					let key = propsToUpdate[i];
					if (isEmitListener(instance.emitsOptions, key)) continue;
					const value = rawProps[key];
					if (options) if (hasOwn(attrs, key)) {
						if (value !== attrs[key]) {
							attrs[key] = value;
							hasAttrsChanged = true;
						}
					} else {
						const camelizedKey = camelize$1(key);
						props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
					}
					else if (value !== attrs[key]) {
						attrs[key] = value;
						hasAttrsChanged = true;
					}
				}
			}
		} else {
			if (setFullProps(instance, rawProps, props, attrs)) hasAttrsChanged = true;
			let kebabKey;
			for (const key in rawCurrentProps) if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate$1(key)) === key || !hasOwn(rawProps, kebabKey))) if (options) {
				if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
			} else delete props[key];
			if (attrs !== rawCurrentProps) {
				for (const key in attrs) if (!rawProps || !hasOwn(rawProps, key) && true) {
					delete attrs[key];
					hasAttrsChanged = true;
				}
			}
		}
		if (hasAttrsChanged) trigger(instance.attrs, "set", "");
	}
	function setFullProps(instance, rawProps, props, attrs) {
		const [options, needCastKeys] = instance.propsOptions;
		let hasAttrsChanged = false;
		let rawCastValues;
		if (rawProps) for (let key in rawProps) {
			if (isReservedProp(key)) continue;
			const value = rawProps[key];
			let camelKey;
			if (options && hasOwn(options, camelKey = camelize$1(key))) if (!needCastKeys || !needCastKeys.includes(camelKey)) props[camelKey] = value;
			else (rawCastValues || (rawCastValues = {}))[camelKey] = value;
			else if (!isEmitListener(instance.emitsOptions, key)) {
				if (!(key in attrs) || value !== attrs[key]) {
					attrs[key] = value;
					hasAttrsChanged = true;
				}
			}
		}
		if (needCastKeys) {
			const rawCurrentProps = /* @__PURE__ */ toRaw(props);
			const castValues = rawCastValues || EMPTY_OBJ;
			for (let i = 0; i < needCastKeys.length; i++) {
				const key = needCastKeys[i];
				props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
			}
		}
		return hasAttrsChanged;
	}
	function resolvePropValue(options, props, key, value, instance, isAbsent) {
		const opt = options[key];
		if (opt != null) {
			const hasDefault = hasOwn(opt, "default");
			if (hasDefault && value === void 0) {
				const defaultValue = opt.default;
				if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
					const { propsDefaults } = instance;
					if (key in propsDefaults) value = propsDefaults[key];
					else {
						const reset = setCurrentInstance(instance);
						value = propsDefaults[key] = defaultValue.call(null, props);
						reset();
					}
				} else value = defaultValue;
				if (instance.ce) instance.ce._setProp(key, value);
			}
			if (opt[0]) {
				if (isAbsent && !hasDefault) value = false;
				else if (opt[1] && (value === "" || value === hyphenate$1(key))) value = true;
			}
		}
		return value;
	}
	var mixinPropsCache = /* @__PURE__ */ new WeakMap();
	function normalizePropsOptions(comp, appContext, asMixin = false) {
		const cache = asMixin ? mixinPropsCache : appContext.propsCache;
		const cached = cache.get(comp);
		if (cached) return cached;
		const raw = comp.props;
		const normalized = {};
		const needCastKeys = [];
		let hasExtends = false;
		if (!isFunction(comp)) {
			const extendProps = (raw2) => {
				hasExtends = true;
				const [props, keys] = normalizePropsOptions(raw2, appContext, true);
				extend(normalized, props);
				if (keys) needCastKeys.push(...keys);
			};
			if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendProps);
			if (comp.extends) extendProps(comp.extends);
			if (comp.mixins) comp.mixins.forEach(extendProps);
		}
		if (!raw && !hasExtends) {
			if (isObject$1(comp)) cache.set(comp, EMPTY_ARR);
			return EMPTY_ARR;
		}
		if (isArray(raw)) for (let i = 0; i < raw.length; i++) {
			const normalizedKey = camelize$1(raw[i]);
			if (validatePropName(normalizedKey)) normalized[normalizedKey] = EMPTY_OBJ;
		}
		else if (raw) for (const key in raw) {
			const normalizedKey = camelize$1(key);
			if (validatePropName(normalizedKey)) {
				const opt = raw[key];
				const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
				const propType = prop.type;
				let shouldCast = false;
				let shouldCastTrue = true;
				if (isArray(propType)) for (let index = 0; index < propType.length; ++index) {
					const type = propType[index];
					const typeName = isFunction(type) && type.name;
					if (typeName === "Boolean") {
						shouldCast = true;
						break;
					} else if (typeName === "String") shouldCastTrue = false;
				}
				else shouldCast = isFunction(propType) && propType.name === "Boolean";
				prop[0] = shouldCast;
				prop[1] = shouldCastTrue;
				if (shouldCast || hasOwn(prop, "default")) needCastKeys.push(normalizedKey);
			}
		}
		const res = [normalized, needCastKeys];
		if (isObject$1(comp)) cache.set(comp, res);
		return res;
	}
	function validatePropName(key) {
		if (key[0] !== "$" && !isReservedProp(key)) return true;
		return false;
	}
	var isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
	var normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
	var normalizeSlot = (key, rawSlot, ctx) => {
		if (rawSlot._n) return rawSlot;
		const normalized = withCtx((...args) => {
			return normalizeSlotValue(rawSlot(...args));
		}, ctx);
		normalized._c = false;
		return normalized;
	};
	var normalizeObjectSlots = (rawSlots, slots, instance) => {
		const ctx = rawSlots._ctx;
		for (const key in rawSlots) {
			if (isInternalKey(key)) continue;
			const value = rawSlots[key];
			if (isFunction(value)) slots[key] = normalizeSlot(key, value, ctx);
			else if (value != null) {
				const normalized = normalizeSlotValue(value);
				slots[key] = () => normalized;
			}
		}
	};
	var normalizeVNodeSlots = (instance, children) => {
		const normalized = normalizeSlotValue(children);
		instance.slots.default = () => normalized;
	};
	var assignSlots = (slots, children, optimized) => {
		for (const key in children) if (optimized || !isInternalKey(key)) slots[key] = children[key];
	};
	var initSlots = (instance, children, optimized) => {
		const slots = instance.slots = createInternalObject();
		if (instance.vnode.shapeFlag & 32) {
			const type = children._;
			if (type) {
				assignSlots(slots, children, optimized);
				if (optimized) def(slots, "_", type, true);
			} else normalizeObjectSlots(children, slots);
		} else if (children) normalizeVNodeSlots(instance, children);
	};
	var updateSlots = (instance, children, optimized) => {
		const { vnode, slots } = instance;
		let needDeletionCheck = true;
		let deletionComparisonTarget = EMPTY_OBJ;
		if (vnode.shapeFlag & 32) {
			const type = children._;
			if (type) if (optimized && type === 1) needDeletionCheck = false;
			else assignSlots(slots, children, optimized);
			else {
				needDeletionCheck = !children.$stable;
				normalizeObjectSlots(children, slots);
			}
			deletionComparisonTarget = children;
		} else if (children) {
			normalizeVNodeSlots(instance, children);
			deletionComparisonTarget = { default: 1 };
		}
		if (needDeletionCheck) {
			for (const key in slots) if (!isInternalKey(key) && deletionComparisonTarget[key] == null) delete slots[key];
		}
	};
	function initFeatureFlags() {}
	var queuePostRenderEffect = queueEffectWithSuspense;
	function createRenderer(options) {
		return baseCreateRenderer(options);
	}
	function createHydrationRenderer(options) {
		return baseCreateRenderer(options, createHydrationFunctions);
	}
	function baseCreateRenderer(options, createHydrationFns) {
		initFeatureFlags();
		const target = getGlobalThis();
		target.__VUE__ = true;
		const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
		const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
			if (n1 === n2) return;
			if (n1 && !isSameVNodeType(n1, n2)) {
				anchor = getNextHostNode(n1);
				unmount(n1, parentComponent, parentSuspense, true);
				n1 = null;
			}
			if (n2.patchFlag === -2) {
				optimized = false;
				n2.dynamicChildren = null;
			}
			const { type, ref, shapeFlag } = n2;
			switch (type) {
				case Text:
					processText(n1, n2, container, anchor);
					break;
				case Comment:
					processCommentNode(n1, n2, container, anchor);
					break;
				case Static:
					if (n1 == null) mountStaticNode(n2, container, anchor, namespace);
					break;
				case Fragment:
					processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					break;
				default: if (shapeFlag & 1) processElement(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else if (shapeFlag & 6) processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else if (shapeFlag & 64) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
				else if (shapeFlag & 128) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
			}
			if (ref != null && parentComponent) setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
			else if (ref == null && n1 && n1.ref != null) setRef(n1.ref, null, parentSuspense, n1, true);
		};
		const processText = (n1, n2, container, anchor) => {
			if (n1 == null) hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
			else {
				const el = n2.el = n1.el;
				if (n2.children !== n1.children) hostSetText(el, n2.children);
			}
		};
		const processCommentNode = (n1, n2, container, anchor) => {
			if (n1 == null) hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
			else n2.el = n1.el;
		};
		const mountStaticNode = (n2, container, anchor, namespace) => {
			[n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, namespace, n2.el, n2.anchor);
		};
		const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
			let next;
			while (el && el !== anchor) {
				next = hostNextSibling(el);
				hostInsert(el, container, nextSibling);
				el = next;
			}
			hostInsert(anchor, container, nextSibling);
		};
		const removeStaticNode = ({ el, anchor }) => {
			let next;
			while (el && el !== anchor) {
				next = hostNextSibling(el);
				hostRemove(el);
				el = next;
			}
			hostRemove(anchor);
		};
		const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			if (n2.type === "svg") namespace = "svg";
			else if (n2.type === "math") namespace = "mathml";
			if (n1 == null) mountElement(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else {
				const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
				try {
					if (customElement) customElement._beginPatch();
					patchElement(n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				} finally {
					if (customElement) customElement._endPatch();
				}
			}
		};
		const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			let el;
			let vnodeHook;
			const { props, shapeFlag, transition, dirs } = vnode;
			el = vnode.el = hostCreateElement(vnode.type, namespace, props && props.is, props);
			if (shapeFlag & 8) hostSetElementText(el, vnode.children);
			else if (shapeFlag & 16) mountChildren(vnode.children, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(vnode, namespace), slotScopeIds, optimized);
			if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
			setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
			if (props) {
				for (const key in props) if (key !== "value" && !isReservedProp(key)) hostPatchProp(el, key, null, props[key], namespace, parentComponent);
				if ("value" in props) hostPatchProp(el, "value", null, props.value, namespace);
				if (vnodeHook = props.onVnodeBeforeMount) invokeVNodeHook(vnodeHook, parentComponent, vnode);
			}
			if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
			const needCallTransitionHooks = needTransition(parentSuspense, transition);
			if (needCallTransitionHooks) transition.beforeEnter(el);
			hostInsert(el, container, anchor);
			if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) queuePostRenderEffect(() => {
				try {
					vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
					needCallTransitionHooks && transition.enter(el);
					dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
				} finally {}
			}, parentSuspense);
		};
		const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
			if (scopeId) hostSetScopeId(el, scopeId);
			if (slotScopeIds) for (let i = 0; i < slotScopeIds.length; i++) hostSetScopeId(el, slotScopeIds[i]);
			if (parentComponent) {
				let subTree = parentComponent.subTree;
				if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
					const parentVNode = parentComponent.vnode;
					setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
				}
			}
		};
		const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
			for (let i = start; i < children.length; i++) patch(null, children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		};
		const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			const el = n2.el = n1.el;
			let { patchFlag, dynamicChildren, dirs } = n2;
			patchFlag |= n1.patchFlag & 16;
			const oldProps = n1.props || EMPTY_OBJ;
			const newProps = n2.props || EMPTY_OBJ;
			let vnodeHook;
			parentComponent && toggleRecurse(parentComponent, false);
			if (vnodeHook = newProps.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
			if (dirs) invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
			parentComponent && toggleRecurse(parentComponent, true);
			if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) hostSetElementText(el, "");
			if (dynamicChildren) patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds);
			else if (!optimized) patchChildren(n1, n2, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds, false);
			if (patchFlag > 0) {
				if (patchFlag & 16) patchProps(el, oldProps, newProps, parentComponent, namespace);
				else {
					if (patchFlag & 2) {
						if (oldProps.class !== newProps.class) hostPatchProp(el, "class", null, newProps.class, namespace);
					}
					if (patchFlag & 4) hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
					if (patchFlag & 8) {
						const propsToUpdate = n2.dynamicProps;
						for (let i = 0; i < propsToUpdate.length; i++) {
							const key = propsToUpdate[i];
							const prev = oldProps[key];
							const next = newProps[key];
							if (next !== prev || key === "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
						}
					}
				}
				if (patchFlag & 1) {
					if (n1.children !== n2.children) hostSetElementText(el, n2.children);
				}
			} else if (!optimized && dynamicChildren == null) patchProps(el, oldProps, newProps, parentComponent, namespace);
			if ((vnodeHook = newProps.onVnodeUpdated) || dirs) queuePostRenderEffect(() => {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
				dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
			}, parentSuspense);
		};
		const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
			for (let i = 0; i < newChildren.length; i++) {
				const oldVNode = oldChildren[i];
				const newVNode = newChildren[i];
				patch(oldVNode, newVNode, oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & 198) ? hostParentNode(oldVNode.el) : fallbackContainer, null, parentComponent, parentSuspense, namespace, slotScopeIds, true);
			}
		};
		const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
			if (oldProps !== newProps) {
				if (oldProps !== EMPTY_OBJ) {
					for (const key in oldProps) if (!isReservedProp(key) && !(key in newProps)) hostPatchProp(el, key, oldProps[key], null, namespace, parentComponent);
				}
				for (const key in newProps) {
					if (isReservedProp(key)) continue;
					const next = newProps[key];
					const prev = oldProps[key];
					if (next !== prev && key !== "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
				}
				if ("value" in newProps) hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
			}
		};
		const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
			const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
			let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
			if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
			if (n1 == null) {
				hostInsert(fragmentStartAnchor, container, anchor);
				hostInsert(fragmentEndAnchor, container, anchor);
				mountChildren(n2.children || [], container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} else if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
				patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, namespace, slotScopeIds);
				if (n2.key != null || parentComponent && n2 === parentComponent.subTree) traverseStaticChildren(n1, n2, true);
			} else patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		};
		const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			n2.slotScopeIds = slotScopeIds;
			if (n1 == null) if (n2.shapeFlag & 512) parentComponent.ctx.activate(n2, container, anchor, namespace, optimized);
			else mountComponent(n2, container, anchor, parentComponent, parentSuspense, namespace, optimized);
			else updateComponent(n1, n2, optimized);
		};
		const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
			const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
			if (isKeepAlive(initialVNode)) instance.ctx.renderer = internals;
			setupComponent(instance, false, optimized);
			if (instance.asyncDep) {
				parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
				if (!initialVNode.el) {
					const placeholder = instance.subTree = createVNode(Comment);
					processCommentNode(null, placeholder, container, anchor);
					initialVNode.placeholder = placeholder.el;
				}
			} else setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, namespace, optimized);
		};
		const updateComponent = (n1, n2, optimized) => {
			const instance = n2.component = n1.component;
			if (shouldUpdateComponent(n1, n2, optimized)) if (instance.asyncDep && !instance.asyncResolved) {
				updateComponentPreRender(instance, n2, optimized);
				return;
			} else {
				instance.next = n2;
				instance.update();
			}
			else {
				n2.el = n1.el;
				instance.vnode = n2;
			}
		};
		const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
			const componentUpdateFn = () => {
				if (!instance.isMounted) {
					let vnodeHook;
					const { el, props } = initialVNode;
					const { bm, m, parent, root, type } = instance;
					const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
					toggleRecurse(instance, false);
					if (bm) invokeArrayFns(bm);
					if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) invokeVNodeHook(vnodeHook, parent, initialVNode);
					toggleRecurse(instance, true);
					if (el && hydrateNode) {
						const hydrateSubTree = () => {
							instance.subTree = renderComponentRoot(instance);
							hydrateNode(el, instance.subTree, instance, parentSuspense, null);
						};
						if (isAsyncWrapperVNode && type.__asyncHydrate) type.__asyncHydrate(el, instance, hydrateSubTree);
						else hydrateSubTree();
					} else {
						if (root.ce && root.ce._hasShadowRoot()) root.ce._injectChildStyle(type, instance.parent ? instance.parent.type : void 0);
						const subTree = instance.subTree = renderComponentRoot(instance);
						patch(null, subTree, container, anchor, instance, parentSuspense, namespace);
						initialVNode.el = subTree.el;
					}
					if (m) queuePostRenderEffect(m, parentSuspense);
					if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
						const scopedInitialVNode = initialVNode;
						queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
					}
					if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) instance.a && queuePostRenderEffect(instance.a, parentSuspense);
					instance.isMounted = true;
					initialVNode = container = anchor = null;
				} else {
					let { next, bu, u, parent, vnode } = instance;
					{
						const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
						if (nonHydratedAsyncRoot) {
							if (next) {
								next.el = vnode.el;
								updateComponentPreRender(instance, next, optimized);
							}
							nonHydratedAsyncRoot.asyncDep.then(() => {
								queuePostRenderEffect(() => {
									if (!instance.isUnmounted) update();
								}, parentSuspense);
							});
							return;
						}
					}
					let originNext = next;
					let vnodeHook;
					toggleRecurse(instance, false);
					if (next) {
						next.el = vnode.el;
						updateComponentPreRender(instance, next, optimized);
					} else next = vnode;
					if (bu) invokeArrayFns(bu);
					if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parent, next, vnode);
					toggleRecurse(instance, true);
					const nextTree = renderComponentRoot(instance);
					const prevTree = instance.subTree;
					instance.subTree = nextTree;
					patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, namespace);
					next.el = nextTree.el;
					if (originNext === null) updateHOCHostEl(instance, nextTree.el);
					if (u) queuePostRenderEffect(u, parentSuspense);
					if (vnodeHook = next.props && next.props.onVnodeUpdated) queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
				}
			};
			instance.scope.on();
			const effect = instance.effect = new ReactiveEffect(componentUpdateFn);
			instance.scope.off();
			const update = instance.update = effect.run.bind(effect);
			const job = instance.job = effect.runIfDirty.bind(effect);
			job.i = instance;
			job.id = instance.uid;
			effect.scheduler = () => queueJob(job);
			toggleRecurse(instance, true);
			update();
		};
		const updateComponentPreRender = (instance, nextVNode, optimized) => {
			nextVNode.component = instance;
			const prevProps = instance.vnode.props;
			instance.vnode = nextVNode;
			instance.next = null;
			updateProps(instance, nextVNode.props, prevProps, optimized);
			updateSlots(instance, nextVNode.children, optimized);
			pauseTracking();
			flushPreFlushCbs(instance);
			resetTracking();
		};
		const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
			const c1 = n1 && n1.children;
			const prevShapeFlag = n1 ? n1.shapeFlag : 0;
			const c2 = n2.children;
			const { patchFlag, shapeFlag } = n2;
			if (patchFlag > 0) {
				if (patchFlag & 128) {
					patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					return;
				} else if (patchFlag & 256) {
					patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					return;
				}
			}
			if (shapeFlag & 8) {
				if (prevShapeFlag & 16) unmountChildren(c1, parentComponent, parentSuspense);
				if (c2 !== c1) hostSetElementText(container, c2);
			} else if (prevShapeFlag & 16) if (shapeFlag & 16) patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else unmountChildren(c1, parentComponent, parentSuspense, true);
			else {
				if (prevShapeFlag & 8) hostSetElementText(container, "");
				if (shapeFlag & 16) mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			}
		};
		const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			c1 = c1 || EMPTY_ARR;
			c2 = c2 || EMPTY_ARR;
			const oldLength = c1.length;
			const newLength = c2.length;
			const commonLength = Math.min(oldLength, newLength);
			let i;
			for (i = 0; i < commonLength; i++) {
				const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
				patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			}
			if (oldLength > newLength) unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
			else mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, commonLength);
		};
		const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
			let i = 0;
			const l2 = c2.length;
			let e1 = c1.length - 1;
			let e2 = l2 - 1;
			while (i <= e1 && i <= e2) {
				const n1 = c1[i];
				const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
				if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else break;
				i++;
			}
			while (i <= e1 && i <= e2) {
				const n1 = c1[e1];
				const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
				if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else break;
				e1--;
				e2--;
			}
			if (i > e1) {
				if (i <= e2) {
					const nextPos = e2 + 1;
					const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
					while (i <= e2) {
						patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
						i++;
					}
				}
			} else if (i > e2) while (i <= e1) {
				unmount(c1[i], parentComponent, parentSuspense, true);
				i++;
			}
			else {
				const s1 = i;
				const s2 = i;
				const keyToNewIndexMap = /* @__PURE__ */ new Map();
				for (i = s2; i <= e2; i++) {
					const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
					if (nextChild.key != null) keyToNewIndexMap.set(nextChild.key, i);
				}
				let j;
				let patched = 0;
				const toBePatched = e2 - s2 + 1;
				let moved = false;
				let maxNewIndexSoFar = 0;
				const newIndexToOldIndexMap = new Array(toBePatched);
				for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
				for (i = s1; i <= e1; i++) {
					const prevChild = c1[i];
					if (patched >= toBePatched) {
						unmount(prevChild, parentComponent, parentSuspense, true);
						continue;
					}
					let newIndex;
					if (prevChild.key != null) newIndex = keyToNewIndexMap.get(prevChild.key);
					else for (j = s2; j <= e2; j++) if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
						newIndex = j;
						break;
					}
					if (newIndex === void 0) unmount(prevChild, parentComponent, parentSuspense, true);
					else {
						newIndexToOldIndexMap[newIndex - s2] = i + 1;
						if (newIndex >= maxNewIndexSoFar) maxNewIndexSoFar = newIndex;
						else moved = true;
						patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
						patched++;
					}
				}
				const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
				j = increasingNewIndexSequence.length - 1;
				for (i = toBePatched - 1; i >= 0; i--) {
					const nextIndex = s2 + i;
					const nextChild = c2[nextIndex];
					const anchorVNode = c2[nextIndex + 1];
					const anchor = nextIndex + 1 < l2 ? anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode) : parentAnchor;
					if (newIndexToOldIndexMap[i] === 0) patch(null, nextChild, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					else if (moved) if (j < 0 || i !== increasingNewIndexSequence[j]) move(nextChild, container, anchor, 2);
					else j--;
				}
			}
		};
		const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
			const { el, type, transition, children, shapeFlag } = vnode;
			if (shapeFlag & 6) {
				move(vnode.component.subTree, container, anchor, moveType);
				return;
			}
			if (shapeFlag & 128) {
				vnode.suspense.move(container, anchor, moveType);
				return;
			}
			if (shapeFlag & 64) {
				type.move(vnode, container, anchor, internals);
				return;
			}
			if (type === Fragment) {
				hostInsert(el, container, anchor);
				for (let i = 0; i < children.length; i++) move(children[i], container, anchor, moveType);
				hostInsert(vnode.anchor, container, anchor);
				return;
			}
			if (type === Static) {
				moveStaticNode(vnode, container, anchor);
				return;
			}
			if (moveType !== 2 && shapeFlag & 1 && transition) if (moveType === 0) {
				transition.beforeEnter(el);
				hostInsert(el, container, anchor);
				queuePostRenderEffect(() => transition.enter(el), parentSuspense);
			} else {
				const { leave, delayLeave, afterLeave } = transition;
				const remove2 = () => {
					if (vnode.ctx.isUnmounted) hostRemove(el);
					else hostInsert(el, container, anchor);
				};
				const performLeave = () => {
					if (el._isLeaving) el[leaveCbKey](true);
					leave(el, () => {
						remove2();
						afterLeave && afterLeave();
					});
				};
				if (delayLeave) delayLeave(el, remove2, performLeave);
				else performLeave();
			}
			else hostInsert(el, container, anchor);
		};
		const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
			const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs, cacheIndex, memo } = vnode;
			if (patchFlag === -2) optimized = false;
			if (ref != null) {
				pauseTracking();
				setRef(ref, null, parentSuspense, vnode, true);
				resetTracking();
			}
			if (cacheIndex != null) parentComponent.renderCache[cacheIndex] = void 0;
			if (shapeFlag & 256) {
				parentComponent.ctx.deactivate(vnode);
				return;
			}
			const shouldInvokeDirs = shapeFlag & 1 && dirs;
			const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
			let vnodeHook;
			if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) invokeVNodeHook(vnodeHook, parentComponent, vnode);
			if (shapeFlag & 6) unmountComponent(vnode.component, parentSuspense, doRemove);
			else {
				if (shapeFlag & 128) {
					vnode.suspense.unmount(parentSuspense, doRemove);
					return;
				}
				if (shouldInvokeDirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
				if (shapeFlag & 64) vnode.type.remove(vnode, parentComponent, parentSuspense, internals, doRemove);
				else if (dynamicChildren && !dynamicChildren.hasOnce && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
				else if (type === Fragment && patchFlag & 384 || !optimized && shapeFlag & 16) unmountChildren(children, parentComponent, parentSuspense);
				if (doRemove) remove(vnode);
			}
			const shouldInvalidateMemo = memo != null && cacheIndex == null;
			if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) queuePostRenderEffect(() => {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
				shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
				if (shouldInvalidateMemo) vnode.el = null;
			}, parentSuspense);
		};
		const remove = (vnode) => {
			const { type, el, anchor, transition } = vnode;
			if (type === Fragment) {
				removeFragment(el, anchor);
				return;
			}
			if (type === Static) {
				removeStaticNode(vnode);
				return;
			}
			const performRemove = () => {
				hostRemove(el);
				if (transition && !transition.persisted && transition.afterLeave) transition.afterLeave();
			};
			if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
				const { leave, delayLeave } = transition;
				const performLeave = () => leave(el, performRemove);
				if (delayLeave) delayLeave(vnode.el, performRemove, performLeave);
				else performLeave();
			} else performRemove();
		};
		const removeFragment = (cur, end) => {
			let next;
			while (cur !== end) {
				next = hostNextSibling(cur);
				hostRemove(cur);
				cur = next;
			}
			hostRemove(end);
		};
		const unmountComponent = (instance, parentSuspense, doRemove) => {
			const { bum, scope, job, subTree, um, m, a } = instance;
			invalidateMount(m);
			invalidateMount(a);
			if (bum) invokeArrayFns(bum);
			scope.stop();
			if (job) {
				job.flags |= 8;
				unmount(subTree, instance, parentSuspense, doRemove);
			}
			if (um) queuePostRenderEffect(um, parentSuspense);
			queuePostRenderEffect(() => {
				instance.isUnmounted = true;
			}, parentSuspense);
		};
		const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
			for (let i = start; i < children.length; i++) unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
		};
		const getNextHostNode = (vnode) => {
			if (vnode.shapeFlag & 6) return getNextHostNode(vnode.component.subTree);
			if (vnode.shapeFlag & 128) return vnode.suspense.next();
			const el = hostNextSibling(vnode.anchor || vnode.el);
			const teleportEnd = el && el[TeleportEndKey];
			return teleportEnd ? hostNextSibling(teleportEnd) : el;
		};
		let isFlushing = false;
		const render = (vnode, container, namespace) => {
			let instance;
			if (vnode == null) {
				if (container._vnode) {
					unmount(container._vnode, null, null, true);
					instance = container._vnode.component;
				}
			} else patch(container._vnode || null, vnode, container, null, null, null, namespace);
			container._vnode = vnode;
			if (!isFlushing) {
				isFlushing = true;
				flushPreFlushCbs(instance);
				flushPostFlushCbs();
				isFlushing = false;
			}
		};
		const internals = {
			p: patch,
			um: unmount,
			m: move,
			r: remove,
			mt: mountComponent,
			mc: mountChildren,
			pc: patchChildren,
			pbc: patchBlockChildren,
			n: getNextHostNode,
			o: options
		};
		let hydrate;
		let hydrateNode;
		if (createHydrationFns) [hydrate, hydrateNode] = createHydrationFns(internals);
		return {
			render,
			hydrate,
			createApp: createAppAPI(render, hydrate)
		};
	}
	function resolveChildrenNamespace({ type, props }, currentNamespace) {
		return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
	}
	function toggleRecurse({ effect, job }, allowed) {
		if (allowed) {
			effect.flags |= 32;
			job.flags |= 4;
		} else {
			effect.flags &= -33;
			job.flags &= -5;
		}
	}
	function needTransition(parentSuspense, transition) {
		return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
	}
	function traverseStaticChildren(n1, n2, shallow = false) {
		const ch1 = n1.children;
		const ch2 = n2.children;
		if (isArray(ch1) && isArray(ch2)) for (let i = 0; i < ch1.length; i++) {
			const c1 = ch1[i];
			let c2 = ch2[i];
			if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
				if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
					c2 = ch2[i] = cloneIfMounted(ch2[i]);
					c2.el = c1.el;
				}
				if (!shallow && c2.patchFlag !== -2) traverseStaticChildren(c1, c2);
			}
			if (c2.type === Text) {
				if (c2.patchFlag === -1) c2 = ch2[i] = cloneIfMounted(c2);
				c2.el = c1.el;
			}
			if (c2.type === Comment && !c2.el) c2.el = c1.el;
		}
	}
	function getSequence(arr) {
		const p = arr.slice();
		const result = [0];
		let i, j, u, v, c;
		const len = arr.length;
		for (i = 0; i < len; i++) {
			const arrI = arr[i];
			if (arrI !== 0) {
				j = result[result.length - 1];
				if (arr[j] < arrI) {
					p[i] = j;
					result.push(i);
					continue;
				}
				u = 0;
				v = result.length - 1;
				while (u < v) {
					c = u + v >> 1;
					if (arr[result[c]] < arrI) u = c + 1;
					else v = c;
				}
				if (arrI < arr[result[u]]) {
					if (u > 0) p[i] = result[u - 1];
					result[u] = i;
				}
			}
		}
		u = result.length;
		v = result[u - 1];
		while (u-- > 0) {
			result[u] = v;
			v = p[v];
		}
		return result;
	}
	function locateNonHydratedAsyncRoot(instance) {
		const subComponent = instance.subTree.component;
		if (subComponent) if (subComponent.asyncDep && !subComponent.asyncResolved) return subComponent;
		else return locateNonHydratedAsyncRoot(subComponent);
	}
	function invalidateMount(hooks) {
		if (hooks) for (let i = 0; i < hooks.length; i++) hooks[i].flags |= 8;
	}
	function resolveAsyncComponentPlaceholder(anchorVnode) {
		if (anchorVnode.placeholder) return anchorVnode.placeholder;
		const instance = anchorVnode.component;
		if (instance) return resolveAsyncComponentPlaceholder(instance.subTree);
		return null;
	}
	var isSuspense = (type) => type.__isSuspense;
	var suspenseId = 0;
	var Suspense = {
		name: "Suspense",
		__isSuspense: true,
		process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
			if (n1 == null) mountSuspense(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals);
			else {
				if (parentSuspense && parentSuspense.deps > 0 && !n1.suspense.isInFallback) {
					n2.suspense = n1.suspense;
					n2.suspense.vnode = n2;
					n2.el = n1.el;
					return;
				}
				patchSuspense(n1, n2, container, anchor, parentComponent, namespace, slotScopeIds, optimized, rendererInternals);
			}
		},
		hydrate: hydrateSuspense,
		normalize: normalizeSuspenseChildren
	};
	function triggerEvent(vnode, name) {
		const eventListener = vnode.props && vnode.props[name];
		if (isFunction(eventListener)) eventListener();
	}
	function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals) {
		const { p: patch, o: { createElement } } = rendererInternals;
		const hiddenContainer = createElement("div");
		const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, namespace, slotScopeIds, optimized, rendererInternals);
		patch(null, suspense.pendingBranch = vnode.ssContent, hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds);
		if (suspense.deps > 0) {
			triggerEvent(vnode, "onPending");
			triggerEvent(vnode, "onFallback");
			patch(null, vnode.ssFallback, container, anchor, parentComponent, null, namespace, slotScopeIds);
			setActiveBranch(suspense, vnode.ssFallback);
		} else suspense.resolve(false, true);
	}
	function patchSuspense(n1, n2, container, anchor, parentComponent, namespace, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
		const suspense = n2.suspense = n1.suspense;
		suspense.vnode = n2;
		n2.el = n1.el;
		const newBranch = n2.ssContent;
		const newFallback = n2.ssFallback;
		const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
		if (pendingBranch) {
			suspense.pendingBranch = newBranch;
			if (isSameVNodeType(pendingBranch, newBranch)) {
				patch(pendingBranch, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
				if (suspense.deps <= 0) suspense.resolve();
				else if (isInFallback) {
					if (!isHydrating) {
						patch(activeBranch, newFallback, container, anchor, parentComponent, null, namespace, slotScopeIds, optimized);
						setActiveBranch(suspense, newFallback);
					}
				}
			} else {
				suspense.pendingId = suspenseId++;
				if (isHydrating) {
					suspense.isHydrating = false;
					suspense.activeBranch = pendingBranch;
				} else unmount(pendingBranch, parentComponent, suspense);
				suspense.deps = 0;
				suspense.effects.length = 0;
				suspense.hiddenContainer = createElement("div");
				if (isInFallback) {
					patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
					if (suspense.deps <= 0) suspense.resolve();
					else {
						patch(activeBranch, newFallback, container, anchor, parentComponent, null, namespace, slotScopeIds, optimized);
						setActiveBranch(suspense, newFallback);
					}
				} else if (activeBranch && isSameVNodeType(activeBranch, newBranch)) {
					patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, namespace, slotScopeIds, optimized);
					suspense.resolve(true);
				} else {
					patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
					if (suspense.deps <= 0) suspense.resolve();
				}
			}
		} else if (activeBranch && isSameVNodeType(activeBranch, newBranch)) {
			patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, namespace, slotScopeIds, optimized);
			setActiveBranch(suspense, newBranch);
		} else {
			triggerEvent(n2, "onPending");
			suspense.pendingBranch = newBranch;
			if (newBranch.shapeFlag & 512) suspense.pendingId = newBranch.component.suspenseId;
			else suspense.pendingId = suspenseId++;
			patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, namespace, slotScopeIds, optimized);
			if (suspense.deps <= 0) suspense.resolve();
			else {
				const { timeout, pendingId } = suspense;
				if (timeout > 0) setTimeout(() => {
					if (suspense.pendingId === pendingId) suspense.fallback(newFallback);
				}, timeout);
				else if (timeout === 0) suspense.fallback(newFallback);
			}
		}
	}
	function createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, namespace, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
		const { p: patch, m: move, um: unmount, n: next, o: { parentNode, remove } } = rendererInternals;
		let parentSuspenseId;
		const isSuspensible = isVNodeSuspensible(vnode);
		if (isSuspensible) {
			if (parentSuspense && parentSuspense.pendingBranch) {
				parentSuspenseId = parentSuspense.pendingId;
				parentSuspense.deps++;
			}
		}
		const timeout = vnode.props ? toNumber(vnode.props.timeout) : void 0;
		const initialAnchor = anchor;
		const suspense = {
			vnode,
			parent: parentSuspense,
			parentComponent,
			namespace,
			container,
			hiddenContainer,
			deps: 0,
			pendingId: suspenseId++,
			timeout: typeof timeout === "number" ? timeout : -1,
			activeBranch: null,
			isFallbackMountPending: false,
			pendingBranch: null,
			isInFallback: !isHydrating,
			isHydrating,
			isUnmounted: false,
			effects: [],
			resolve(resume = false, sync = false) {
				const { vnode: vnode2, activeBranch, pendingBranch, pendingId, effects, parentComponent: parentComponent2, container: container2, isInFallback } = suspense;
				let delayEnter = false;
				if (suspense.isHydrating) suspense.isHydrating = false;
				else if (!resume) {
					delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
					if (delayEnter) activeBranch.transition.afterLeave = () => {
						if (pendingId === suspense.pendingId) {
							move(pendingBranch, container2, anchor === initialAnchor ? next(activeBranch) : anchor, 0);
							queuePostFlushCb(effects);
							if (isInFallback && vnode2.ssFallback) vnode2.ssFallback.el = null;
						}
					};
					if (activeBranch && !suspense.isFallbackMountPending) {
						if (parentNode(activeBranch.el) === container2) anchor = next(activeBranch);
						unmount(activeBranch, parentComponent2, suspense, true);
						if (!delayEnter && isInFallback && vnode2.ssFallback) queuePostRenderEffect(() => vnode2.ssFallback.el = null, suspense);
					}
					if (!delayEnter) move(pendingBranch, container2, anchor, 0);
				}
				suspense.isFallbackMountPending = false;
				setActiveBranch(suspense, pendingBranch);
				suspense.pendingBranch = null;
				suspense.isInFallback = false;
				let parent = suspense.parent;
				let hasUnresolvedAncestor = false;
				while (parent) {
					if (parent.pendingBranch) {
						parent.effects.push(...effects);
						hasUnresolvedAncestor = true;
						break;
					}
					parent = parent.parent;
				}
				if (!hasUnresolvedAncestor && !delayEnter) queuePostFlushCb(effects);
				suspense.effects = [];
				if (isSuspensible) {
					if (parentSuspense && parentSuspense.pendingBranch && parentSuspenseId === parentSuspense.pendingId) {
						parentSuspense.deps--;
						if (parentSuspense.deps === 0 && !sync) parentSuspense.resolve();
					}
				}
				triggerEvent(vnode2, "onResolve");
			},
			fallback(fallbackVNode) {
				if (!suspense.pendingBranch) return;
				const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, namespace: namespace2 } = suspense;
				triggerEvent(vnode2, "onFallback");
				const anchor2 = next(activeBranch);
				const mountFallback = () => {
					suspense.isFallbackMountPending = false;
					if (!suspense.isInFallback) return;
					patch(null, fallbackVNode, container2, anchor2, parentComponent2, null, namespace2, slotScopeIds, optimized);
					setActiveBranch(suspense, fallbackVNode);
				};
				const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
				if (delayEnter) {
					suspense.isFallbackMountPending = true;
					activeBranch.transition.afterLeave = mountFallback;
				}
				suspense.isInFallback = true;
				unmount(activeBranch, parentComponent2, null, true);
				if (!delayEnter) mountFallback();
			},
			move(container2, anchor2, type) {
				suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
				suspense.container = container2;
			},
			next() {
				return suspense.activeBranch && next(suspense.activeBranch);
			},
			registerDep(instance, setupRenderEffect, optimized2) {
				const isInPendingSuspense = !!suspense.pendingBranch;
				if (isInPendingSuspense) suspense.deps++;
				const hydratedEl = instance.vnode.el;
				instance.asyncDep.catch((err) => {
					handleError(err, instance, 0);
				}).then((asyncSetupResult) => {
					if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) return;
					unsetCurrentInstance();
					instance.asyncResolved = true;
					const { vnode: vnode2 } = instance;
					handleSetupResult(instance, asyncSetupResult, false);
					if (hydratedEl) vnode2.el = hydratedEl;
					const placeholder = !hydratedEl && instance.subTree.el;
					setupRenderEffect(instance, vnode2, parentNode(hydratedEl || instance.subTree.el), hydratedEl ? null : next(instance.subTree), suspense, namespace, optimized2);
					if (placeholder) {
						vnode2.placeholder = null;
						remove(placeholder);
					}
					updateHOCHostEl(instance, vnode2.el);
					if (isInPendingSuspense && --suspense.deps === 0) suspense.resolve();
				});
			},
			unmount(parentSuspense2, doRemove) {
				suspense.isUnmounted = true;
				if (suspense.activeBranch) unmount(suspense.activeBranch, parentComponent, parentSuspense2, doRemove);
				if (suspense.pendingBranch) unmount(suspense.pendingBranch, parentComponent, parentSuspense2, doRemove);
			}
		};
		return suspense;
	}
	function hydrateSuspense(node, vnode, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, rendererInternals, hydrateNode) {
		const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node.parentNode, document.createElement("div"), null, namespace, slotScopeIds, optimized, rendererInternals, true);
		const result = hydrateNode(node, suspense.pendingBranch = vnode.ssContent, parentComponent, suspense, slotScopeIds, optimized);
		if (suspense.deps === 0) suspense.resolve(false, true);
		return result;
	}
	function normalizeSuspenseChildren(vnode) {
		const { shapeFlag, children } = vnode;
		const isSlotChildren = shapeFlag & 32;
		vnode.ssContent = normalizeSuspenseSlot(isSlotChildren ? children.default : children);
		vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
	}
	function normalizeSuspenseSlot(s) {
		let block;
		if (isFunction(s)) {
			const trackBlock = isBlockTreeEnabled && s._c;
			if (trackBlock) {
				s._d = false;
				openBlock();
			}
			s = s();
			if (trackBlock) {
				s._d = true;
				block = currentBlock;
				closeBlock();
			}
		}
		if (isArray(s)) s = filterSingleRoot(s);
		s = normalizeVNode(s);
		if (block && !s.dynamicChildren) s.dynamicChildren = block.filter((c) => c !== s);
		return s;
	}
	function queueEffectWithSuspense(fn, suspense) {
		if (suspense && suspense.pendingBranch) if (isArray(fn)) suspense.effects.push(...fn);
		else suspense.effects.push(fn);
		else queuePostFlushCb(fn);
	}
	function setActiveBranch(suspense, branch) {
		suspense.activeBranch = branch;
		const { vnode, parentComponent } = suspense;
		let el = branch.el;
		while (!el && branch.component) {
			branch = branch.component.subTree;
			el = branch.el;
		}
		vnode.el = el;
		if (parentComponent && parentComponent.subTree === vnode) {
			parentComponent.vnode.el = el;
			updateHOCHostEl(parentComponent, el);
		}
	}
	function isVNodeSuspensible(vnode) {
		const suspensible = vnode.props && vnode.props.suspensible;
		return suspensible != null && suspensible !== false;
	}
	var Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
	var Text = /* @__PURE__ */ Symbol.for("v-txt");
	var Comment = /* @__PURE__ */ Symbol.for("v-cmt");
	var Static = /* @__PURE__ */ Symbol.for("v-stc");
	var blockStack = [];
	var currentBlock = null;
	function openBlock(disableTracking = false) {
		blockStack.push(currentBlock = disableTracking ? null : []);
	}
	function closeBlock() {
		blockStack.pop();
		currentBlock = blockStack[blockStack.length - 1] || null;
	}
	var isBlockTreeEnabled = 1;
	function setBlockTracking(value, inVOnce = false) {
		isBlockTreeEnabled += value;
		if (value < 0 && currentBlock && inVOnce) currentBlock.hasOnce = true;
	}
	function setupBlock(vnode) {
		vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
		closeBlock();
		if (isBlockTreeEnabled > 0 && currentBlock) currentBlock.push(vnode);
		return vnode;
	}
	function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
		return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
	}
	function createBlock(type, props, children, patchFlag, dynamicProps) {
		return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
	}
	function isVNode(value) {
		return value ? value.__v_isVNode === true : false;
	}
	function isSameVNodeType(n1, n2) {
		return n1.type === n2.type && n1.key === n2.key;
	}
	function transformVNodeArgs(transformer) {}
	var normalizeKey = ({ key }) => key != null ? key : null;
	var normalizeRef = ({ ref, ref_key, ref_for }) => {
		if (typeof ref === "number") ref = "" + ref;
		return ref != null ? isString(ref) || /* @__PURE__ */ isRef(ref) || isFunction(ref) ? {
			i: currentRenderingInstance,
			r: ref,
			k: ref_key,
			f: !!ref_for
		} : ref : null;
	};
	function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
		const vnode = {
			__v_isVNode: true,
			__v_skip: true,
			type,
			props,
			key: props && normalizeKey(props),
			ref: props && normalizeRef(props),
			scopeId: currentScopeId,
			slotScopeIds: null,
			children,
			component: null,
			suspense: null,
			ssContent: null,
			ssFallback: null,
			dirs: null,
			transition: null,
			el: null,
			anchor: null,
			target: null,
			targetStart: null,
			targetAnchor: null,
			staticCount: 0,
			shapeFlag,
			patchFlag,
			dynamicProps,
			dynamicChildren: null,
			appContext: null,
			ctx: currentRenderingInstance
		};
		if (needFullChildrenNormalization) {
			normalizeChildren(vnode, children);
			if (shapeFlag & 128) type.normalize(vnode);
		} else if (children) vnode.shapeFlag |= isString(children) ? 8 : 16;
		if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) currentBlock.push(vnode);
		return vnode;
	}
	var createVNode = _createVNode;
	function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
		if (!type || type === NULL_DYNAMIC_COMPONENT) type = Comment;
		if (isVNode(type)) {
			const cloned = cloneVNode(type, props, true);
			if (children) normalizeChildren(cloned, children);
			if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) if (cloned.shapeFlag & 6) currentBlock[currentBlock.indexOf(type)] = cloned;
			else currentBlock.push(cloned);
			cloned.patchFlag = -2;
			return cloned;
		}
		if (isClassComponent(type)) type = type.__vccOpts;
		if (props) {
			props = guardReactiveProps(props);
			let { class: klass, style } = props;
			if (klass && !isString(klass)) props.class = normalizeClass(klass);
			if (isObject$1(style)) {
				if (/* @__PURE__ */ isProxy(style) && !isArray(style)) style = extend({}, style);
				props.style = normalizeStyle(style);
			}
		}
		const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction(type) ? 2 : 0;
		return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
	}
	function guardReactiveProps(props) {
		if (!props) return null;
		return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
	}
	function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
		const { props, ref, patchFlag, children, transition } = vnode;
		const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
		const cloned = {
			__v_isVNode: true,
			__v_skip: true,
			type: vnode.type,
			props: mergedProps,
			key: mergedProps && normalizeKey(mergedProps),
			ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
			scopeId: vnode.scopeId,
			slotScopeIds: vnode.slotScopeIds,
			children,
			target: vnode.target,
			targetStart: vnode.targetStart,
			targetAnchor: vnode.targetAnchor,
			staticCount: vnode.staticCount,
			shapeFlag: vnode.shapeFlag,
			patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
			dynamicProps: vnode.dynamicProps,
			dynamicChildren: vnode.dynamicChildren,
			appContext: vnode.appContext,
			dirs: vnode.dirs,
			transition,
			component: vnode.component,
			suspense: vnode.suspense,
			ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
			ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
			placeholder: vnode.placeholder,
			el: vnode.el,
			anchor: vnode.anchor,
			ctx: vnode.ctx,
			ce: vnode.ce
		};
		if (transition && cloneTransition) setTransitionHooks(cloned, transition.clone(cloned));
		return cloned;
	}
	function createTextVNode(text = " ", flag = 0) {
		return createVNode(Text, null, text, flag);
	}
	function createStaticVNode(content, numberOfNodes) {
		const vnode = createVNode(Static, null, content);
		vnode.staticCount = numberOfNodes;
		return vnode;
	}
	function createCommentVNode(text = "", asBlock = false) {
		return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
	}
	function normalizeVNode(child) {
		if (child == null || typeof child === "boolean") return createVNode(Comment);
		else if (isArray(child)) return createVNode(Fragment, null, child.slice());
		else if (isVNode(child)) return cloneIfMounted(child);
		else return createVNode(Text, null, String(child));
	}
	function cloneIfMounted(child) {
		return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
	}
	function normalizeChildren(vnode, children) {
		let type = 0;
		const { shapeFlag } = vnode;
		if (children == null) children = null;
		else if (isArray(children)) type = 16;
		else if (typeof children === "object") if (shapeFlag & 65) {
			const slot = children.default;
			if (slot) {
				slot._c && (slot._d = false);
				normalizeChildren(vnode, slot());
				slot._c && (slot._d = true);
			}
			return;
		} else {
			type = 32;
			const slotFlag = children._;
			if (!slotFlag && !isInternalObject(children)) children._ctx = currentRenderingInstance;
			else if (slotFlag === 3 && currentRenderingInstance) if (currentRenderingInstance.slots._ === 1) children._ = 1;
			else {
				children._ = 2;
				vnode.patchFlag |= 1024;
			}
		}
		else if (isFunction(children)) {
			children = {
				default: children,
				_ctx: currentRenderingInstance
			};
			type = 32;
		} else {
			children = String(children);
			if (shapeFlag & 64) {
				type = 16;
				children = [createTextVNode(children)];
			} else type = 8;
		}
		vnode.children = children;
		vnode.shapeFlag |= type;
	}
	function mergeProps(...args) {
		const ret = {};
		for (let i = 0; i < args.length; i++) {
			const toMerge = args[i];
			for (const key in toMerge) if (key === "class") {
				if (ret.class !== toMerge.class) ret.class = normalizeClass([ret.class, toMerge.class]);
			} else if (key === "style") ret.style = normalizeStyle([ret.style, toMerge.style]);
			else if (isOn(key)) {
				const existing = ret[key];
				const incoming = toMerge[key];
				if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) ret[key] = existing ? [].concat(existing, incoming) : incoming;
				else if (incoming == null && existing == null && !isModelListener(key)) ret[key] = incoming;
			} else if (key !== "") ret[key] = toMerge[key];
		}
		return ret;
	}
	function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
		callWithAsyncErrorHandling(hook, instance, 7, [vnode, prevVNode]);
	}
	var emptyAppContext = createAppContext();
	var uid = 0;
	function createComponentInstance(vnode, parent, suspense) {
		const type = vnode.type;
		const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
		const instance = {
			uid: uid++,
			vnode,
			type,
			parent,
			appContext,
			root: null,
			next: null,
			subTree: null,
			effect: null,
			update: null,
			job: null,
			scope: new EffectScope(true),
			render: null,
			proxy: null,
			exposed: null,
			exposeProxy: null,
			withProxy: null,
			provides: parent ? parent.provides : Object.create(appContext.provides),
			ids: parent ? parent.ids : [
				"",
				0,
				0
			],
			accessCache: null,
			renderCache: [],
			components: null,
			directives: null,
			propsOptions: normalizePropsOptions(type, appContext),
			emitsOptions: normalizeEmitsOptions(type, appContext),
			emit: null,
			emitted: null,
			propsDefaults: EMPTY_OBJ,
			inheritAttrs: type.inheritAttrs,
			ctx: EMPTY_OBJ,
			data: EMPTY_OBJ,
			props: EMPTY_OBJ,
			attrs: EMPTY_OBJ,
			slots: EMPTY_OBJ,
			refs: EMPTY_OBJ,
			setupState: EMPTY_OBJ,
			setupContext: null,
			suspense,
			suspenseId: suspense ? suspense.pendingId : 0,
			asyncDep: null,
			asyncResolved: false,
			isMounted: false,
			isUnmounted: false,
			isDeactivated: false,
			bc: null,
			c: null,
			bm: null,
			m: null,
			bu: null,
			u: null,
			um: null,
			bum: null,
			da: null,
			a: null,
			rtg: null,
			rtc: null,
			ec: null,
			sp: null
		};
		instance.ctx = { _: instance };
		instance.root = parent ? parent.root : instance;
		instance.emit = emit.bind(null, instance);
		if (vnode.ce) vnode.ce(instance);
		return instance;
	}
	var currentInstance = null;
	var getCurrentInstance = () => currentInstance || currentRenderingInstance;
	var internalSetCurrentInstance;
	var setInSSRSetupState;
	{
		const g = getGlobalThis();
		const registerGlobalSetter = (key, setter) => {
			let setters;
			if (!(setters = g[key])) setters = g[key] = [];
			setters.push(setter);
			return (v) => {
				if (setters.length > 1) setters.forEach((set) => set(v));
				else setters[0](v);
			};
		};
		internalSetCurrentInstance = registerGlobalSetter(`__VUE_INSTANCE_SETTERS__`, (v) => currentInstance = v);
		setInSSRSetupState = registerGlobalSetter(`__VUE_SSR_SETTERS__`, (v) => isInSSRComponentSetup = v);
	}
	var setCurrentInstance = (instance) => {
		const prev = currentInstance;
		internalSetCurrentInstance(instance);
		instance.scope.on();
		return () => {
			instance.scope.off();
			internalSetCurrentInstance(prev);
		};
	};
	var unsetCurrentInstance = () => {
		currentInstance && currentInstance.scope.off();
		internalSetCurrentInstance(null);
	};
	function isStatefulComponent(instance) {
		return instance.vnode.shapeFlag & 4;
	}
	var isInSSRComponentSetup = false;
	function setupComponent(instance, isSSR = false, optimized = false) {
		isSSR && setInSSRSetupState(isSSR);
		const { props, children } = instance.vnode;
		const isStateful = isStatefulComponent(instance);
		initProps(instance, props, isStateful, isSSR);
		initSlots(instance, children, optimized || isSSR);
		const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
		isSSR && setInSSRSetupState(false);
		return setupResult;
	}
	function setupStatefulComponent(instance, isSSR) {
		const Component = instance.type;
		instance.accessCache = /* @__PURE__ */ Object.create(null);
		instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
		const { setup } = Component;
		if (setup) {
			pauseTracking();
			const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
			const reset = setCurrentInstance(instance);
			const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
			const isAsyncSetup = isPromise(setupResult);
			resetTracking();
			reset();
			if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) markAsyncBoundary(instance);
			if (isAsyncSetup) {
				setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
				if (isSSR) return setupResult.then((resolvedResult) => {
					handleSetupResult(instance, resolvedResult, isSSR);
				}).catch((e) => {
					handleError(e, instance, 0);
				});
				else instance.asyncDep = setupResult;
			} else handleSetupResult(instance, setupResult, isSSR);
		} else finishComponentSetup(instance, isSSR);
	}
	function handleSetupResult(instance, setupResult, isSSR) {
		if (isFunction(setupResult)) if (instance.type.__ssrInlineRender) instance.ssrRender = setupResult;
		else instance.render = setupResult;
		else if (isObject$1(setupResult)) instance.setupState = proxyRefs(setupResult);
		finishComponentSetup(instance, isSSR);
	}
	var compile$1;
	var installWithProxy;
	function registerRuntimeCompiler(_compile) {
		compile$1 = _compile;
		installWithProxy = (i) => {
			if (i.render._rc) i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
		};
	}
	var isRuntimeOnly = () => !compile$1;
	function finishComponentSetup(instance, isSSR, skipOptions) {
		const Component = instance.type;
		if (!instance.render) {
			if (!isSSR && compile$1 && !Component.render) {
				const template = Component.template || resolveMergedOptions(instance).template;
				if (template) {
					const { isCustomElement, compilerOptions } = instance.appContext.config;
					const { delimiters, compilerOptions: componentCompilerOptions } = Component;
					const finalCompilerOptions = extend(extend({
						isCustomElement,
						delimiters
					}, compilerOptions), componentCompilerOptions);
					Component.render = compile$1(template, finalCompilerOptions);
				}
			}
			instance.render = Component.render || NOOP;
			if (installWithProxy) installWithProxy(instance);
		}
		{
			const reset = setCurrentInstance(instance);
			pauseTracking();
			try {
				applyOptions(instance);
			} finally {
				resetTracking();
				reset();
			}
		}
	}
	var attrsProxyHandlers = { get(target, key) {
		track(target, "get", "");
		return target[key];
	} };
	function createSetupContext(instance) {
		const expose = (exposed) => {
			instance.exposed = exposed || {};
		};
		return {
			attrs: new Proxy(instance.attrs, attrsProxyHandlers),
			slots: instance.slots,
			emit: instance.emit,
			expose
		};
	}
	function getComponentPublicInstance(instance) {
		if (instance.exposed) return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
			get(target, key) {
				if (key in target) return target[key];
				else if (key in publicPropertiesMap) return publicPropertiesMap[key](instance);
			},
			has(target, key) {
				return key in target || key in publicPropertiesMap;
			}
		}));
		else return instance.proxy;
	}
	function getComponentName(Component, includeInferred = true) {
		return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
	}
	function isClassComponent(value) {
		return isFunction(value) && "__vccOpts" in value;
	}
	var computed = (getterOrOptions, debugOptions) => {
		return /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
	};
	function h(type, propsOrChildren, children) {
		try {
			setBlockTracking(-1);
			const l = arguments.length;
			if (l === 2) if (isObject$1(propsOrChildren) && !isArray(propsOrChildren)) {
				if (isVNode(propsOrChildren)) return createVNode(type, null, [propsOrChildren]);
				return createVNode(type, propsOrChildren);
			} else return createVNode(type, null, propsOrChildren);
			else {
				if (l > 3) children = Array.prototype.slice.call(arguments, 2);
				else if (l === 3 && isVNode(children)) children = [children];
				return createVNode(type, propsOrChildren, children);
			}
		} finally {
			setBlockTracking(1);
		}
	}
	function initCustomFormatter() {
		return;
		function isKeyOfType(Comp, key, type) {
			const opts = Comp[type];
			if (isArray(opts) && opts.includes(key) || isObject$1(opts) && key in opts) return true;
			if (Comp.extends && isKeyOfType(Comp.extends, key, type)) return true;
			if (Comp.mixins && Comp.mixins.some((m) => isKeyOfType(m, key, type))) return true;
		}
	}
	function withMemo(memo, render, cache, index) {
		const cached = cache[index];
		if (cached && isMemoSame(cached, memo)) return cached;
		const ret = render();
		ret.memo = memo.slice();
		ret.cacheIndex = index;
		return cache[index] = ret;
	}
	function isMemoSame(cached, memo) {
		const prev = cached.memo;
		if (prev.length != memo.length) return false;
		for (let i = 0; i < prev.length; i++) if (hasChanged(prev[i], memo[i])) return false;
		if (isBlockTreeEnabled > 0 && currentBlock) currentBlock.push(cached);
		return true;
	}
	var version = "3.5.32";
	var warn = NOOP;
	var ErrorTypeStrings = ErrorTypeStrings$1;
	var devtools = devtools$1;
	var setDevtoolsHook = setDevtoolsHook$1;
	var ssrUtils = {
		createComponentInstance,
		setupComponent,
		renderComponentRoot,
		setCurrentRenderingInstance,
		isVNode,
		normalizeVNode,
		getComponentPublicInstance,
		ensureValidVNode,
		pushWarningContext,
		popWarningContext
	};
	//#endregion
	//#region node_modules/.pnpm/@vue+runtime-dom@3.5.32/node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
	/**
	* @vue/runtime-dom v3.5.32
	* (c) 2018-present Yuxi (Evan) You and Vue contributors
	* @license MIT
	**/
	var policy = void 0;
	var tt = typeof window !== "undefined" && window.trustedTypes;
	if (tt) try {
		policy = /* @__PURE__ */ tt.createPolicy("vue", { createHTML: (val) => val });
	} catch (e) {}
	var unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
	var svgNS = "http://www.w3.org/2000/svg";
	var mathmlNS = "http://www.w3.org/1998/Math/MathML";
	var doc = typeof document !== "undefined" ? document : null;
	var templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
	var nodeOps = {
		insert: (child, parent, anchor) => {
			parent.insertBefore(child, anchor || null);
		},
		remove: (child) => {
			const parent = child.parentNode;
			if (parent) parent.removeChild(child);
		},
		createElement: (tag, namespace, is, props) => {
			const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
			if (tag === "select" && props && props.multiple != null) el.setAttribute("multiple", props.multiple);
			return el;
		},
		createText: (text) => doc.createTextNode(text),
		createComment: (text) => doc.createComment(text),
		setText: (node, text) => {
			node.nodeValue = text;
		},
		setElementText: (el, text) => {
			el.textContent = text;
		},
		parentNode: (node) => node.parentNode,
		nextSibling: (node) => node.nextSibling,
		querySelector: (selector) => doc.querySelector(selector),
		setScopeId(el, id) {
			el.setAttribute(id, "");
		},
		insertStaticContent(content, parent, anchor, namespace, start, end) {
			const before = anchor ? anchor.previousSibling : parent.lastChild;
			if (start && (start === end || start.nextSibling)) while (true) {
				parent.insertBefore(start.cloneNode(true), anchor);
				if (start === end || !(start = start.nextSibling)) break;
			}
			else {
				templateContainer.innerHTML = unsafeToTrustedHTML(namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content);
				const template = templateContainer.content;
				if (namespace === "svg" || namespace === "mathml") {
					const wrapper = template.firstChild;
					while (wrapper.firstChild) template.appendChild(wrapper.firstChild);
					template.removeChild(wrapper);
				}
				parent.insertBefore(template, anchor);
			}
			return [before ? before.nextSibling : parent.firstChild, anchor ? anchor.previousSibling : parent.lastChild];
		}
	};
	var TRANSITION = "transition";
	var ANIMATION = "animation";
	var vtcKey = /* @__PURE__ */ Symbol("_vtc");
	var DOMTransitionPropsValidators = {
		name: String,
		type: String,
		css: {
			type: Boolean,
			default: true
		},
		duration: [
			String,
			Number,
			Object
		],
		enterFromClass: String,
		enterActiveClass: String,
		enterToClass: String,
		appearFromClass: String,
		appearActiveClass: String,
		appearToClass: String,
		leaveFromClass: String,
		leaveActiveClass: String,
		leaveToClass: String
	};
	var TransitionPropsValidators = /* @__PURE__ */ extend({}, BaseTransitionPropsValidators, DOMTransitionPropsValidators);
	var decorate$1 = (t) => {
		t.displayName = "Transition";
		t.props = TransitionPropsValidators;
		return t;
	};
	var Transition = /* @__PURE__ */ decorate$1((props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots));
	var callHook = (hook, args = []) => {
		if (isArray(hook)) hook.forEach((h2) => h2(...args));
		else if (hook) hook(...args);
	};
	var hasExplicitCallback = (hook) => {
		return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
	};
	function resolveTransitionProps(rawProps) {
		const baseProps = {};
		for (const key in rawProps) if (!(key in DOMTransitionPropsValidators)) baseProps[key] = rawProps[key];
		if (rawProps.css === false) return baseProps;
		const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
		const durations = normalizeDuration(duration);
		const enterDuration = durations && durations[0];
		const leaveDuration = durations && durations[1];
		const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
		const finishEnter = (el, isAppear, done, isCancelled) => {
			el._enterCancelled = isCancelled;
			removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
			removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
			done && done();
		};
		const finishLeave = (el, done) => {
			el._isLeaving = false;
			removeTransitionClass(el, leaveFromClass);
			removeTransitionClass(el, leaveToClass);
			removeTransitionClass(el, leaveActiveClass);
			done && done();
		};
		const makeEnterHook = (isAppear) => {
			return (el, done) => {
				const hook = isAppear ? onAppear : onEnter;
				const resolve = () => finishEnter(el, isAppear, done);
				callHook(hook, [el, resolve]);
				nextFrame(() => {
					removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
					addTransitionClass(el, isAppear ? appearToClass : enterToClass);
					if (!hasExplicitCallback(hook)) whenTransitionEnds(el, type, enterDuration, resolve);
				});
			};
		};
		return extend(baseProps, {
			onBeforeEnter(el) {
				callHook(onBeforeEnter, [el]);
				addTransitionClass(el, enterFromClass);
				addTransitionClass(el, enterActiveClass);
			},
			onBeforeAppear(el) {
				callHook(onBeforeAppear, [el]);
				addTransitionClass(el, appearFromClass);
				addTransitionClass(el, appearActiveClass);
			},
			onEnter: makeEnterHook(false),
			onAppear: makeEnterHook(true),
			onLeave(el, done) {
				el._isLeaving = true;
				const resolve = () => finishLeave(el, done);
				addTransitionClass(el, leaveFromClass);
				if (!el._enterCancelled) {
					forceReflow(el);
					addTransitionClass(el, leaveActiveClass);
				} else {
					addTransitionClass(el, leaveActiveClass);
					forceReflow(el);
				}
				nextFrame(() => {
					if (!el._isLeaving) return;
					removeTransitionClass(el, leaveFromClass);
					addTransitionClass(el, leaveToClass);
					if (!hasExplicitCallback(onLeave)) whenTransitionEnds(el, type, leaveDuration, resolve);
				});
				callHook(onLeave, [el, resolve]);
			},
			onEnterCancelled(el) {
				finishEnter(el, false, void 0, true);
				callHook(onEnterCancelled, [el]);
			},
			onAppearCancelled(el) {
				finishEnter(el, true, void 0, true);
				callHook(onAppearCancelled, [el]);
			},
			onLeaveCancelled(el) {
				finishLeave(el);
				callHook(onLeaveCancelled, [el]);
			}
		});
	}
	function normalizeDuration(duration) {
		if (duration == null) return null;
		else if (isObject$1(duration)) return [NumberOf(duration.enter), NumberOf(duration.leave)];
		else {
			const n = NumberOf(duration);
			return [n, n];
		}
	}
	function NumberOf(val) {
		return toNumber(val);
	}
	function addTransitionClass(el, cls) {
		cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
		(el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
	}
	function removeTransitionClass(el, cls) {
		cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
		const _vtc = el[vtcKey];
		if (_vtc) {
			_vtc.delete(cls);
			if (!_vtc.size) el[vtcKey] = void 0;
		}
	}
	function nextFrame(cb) {
		requestAnimationFrame(() => {
			requestAnimationFrame(cb);
		});
	}
	var endId = 0;
	function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
		const id = el._endId = ++endId;
		const resolveIfNotStale = () => {
			if (id === el._endId) resolve();
		};
		if (explicitTimeout != null) return setTimeout(resolveIfNotStale, explicitTimeout);
		const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
		if (!type) return resolve();
		const endEvent = type + "end";
		let ended = 0;
		const end = () => {
			el.removeEventListener(endEvent, onEnd);
			resolveIfNotStale();
		};
		const onEnd = (e) => {
			if (e.target === el && ++ended >= propCount) end();
		};
		setTimeout(() => {
			if (ended < propCount) end();
		}, timeout + 1);
		el.addEventListener(endEvent, onEnd);
	}
	function getTransitionInfo(el, expectedType) {
		const styles = window.getComputedStyle(el);
		const getStyleProperties = (key) => (styles[key] || "").split(", ");
		const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
		const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
		const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
		const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
		const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
		const animationTimeout = getTimeout(animationDelays, animationDurations);
		let type = null;
		let timeout = 0;
		let propCount = 0;
		if (expectedType === TRANSITION) {
			if (transitionTimeout > 0) {
				type = TRANSITION;
				timeout = transitionTimeout;
				propCount = transitionDurations.length;
			}
		} else if (expectedType === ANIMATION) {
			if (animationTimeout > 0) {
				type = ANIMATION;
				timeout = animationTimeout;
				propCount = animationDurations.length;
			}
		} else {
			timeout = Math.max(transitionTimeout, animationTimeout);
			type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
			propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
		}
		const hasTransform = type === TRANSITION && /\b(?:transform|all)(?:,|$)/.test(getStyleProperties(`${TRANSITION}Property`).toString());
		return {
			type,
			timeout,
			propCount,
			hasTransform
		};
	}
	function getTimeout(delays, durations) {
		while (delays.length < durations.length) delays = delays.concat(delays);
		return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
	}
	function toMs(s) {
		if (s === "auto") return 0;
		return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
	}
	function forceReflow(el) {
		return (el ? el.ownerDocument : document).body.offsetHeight;
	}
	function patchClass(el, value, isSVG) {
		const transitionClasses = el[vtcKey];
		if (transitionClasses) value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
		if (value == null) el.removeAttribute("class");
		else if (isSVG) el.setAttribute("class", value);
		else el.className = value;
	}
	var vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
	var vShowHidden = /* @__PURE__ */ Symbol("_vsh");
	var vShow = {
		name: "show",
		beforeMount(el, { value }, { transition }) {
			el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
			if (transition && value) transition.beforeEnter(el);
			else setDisplay(el, value);
		},
		mounted(el, { value }, { transition }) {
			if (transition && value) transition.enter(el);
		},
		updated(el, { value, oldValue }, { transition }) {
			if (!value === !oldValue) return;
			if (transition) if (value) {
				transition.beforeEnter(el);
				setDisplay(el, true);
				transition.enter(el);
			} else transition.leave(el, () => {
				setDisplay(el, false);
			});
			else setDisplay(el, value);
		},
		beforeUnmount(el, { value }) {
			setDisplay(el, value);
		}
	};
	function setDisplay(el, value) {
		el.style.display = value ? el[vShowOriginalDisplay] : "none";
		el[vShowHidden] = !value;
	}
	function initVShowForSSR() {
		vShow.getSSRProps = ({ value }) => {
			if (!value) return { style: { display: "none" } };
		};
	}
	var CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
	function useCssVars(getter) {
		const instance = getCurrentInstance();
		if (!instance) return;
		const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
			Array.from(document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)).forEach((node) => setVarsOnNode(node, vars));
		};
		const setVars = () => {
			const vars = getter(instance.proxy);
			if (instance.ce) setVarsOnNode(instance.ce, vars);
			else setVarsOnVNode(instance.subTree, vars);
			updateTeleports(vars);
		};
		onBeforeUpdate(() => {
			queuePostFlushCb(setVars);
		});
		onMounted(() => {
			watch(setVars, NOOP, { flush: "post" });
			const ob = new MutationObserver(setVars);
			ob.observe(instance.subTree.el.parentNode, { childList: true });
			onUnmounted(() => ob.disconnect());
		});
	}
	function setVarsOnVNode(vnode, vars) {
		if (vnode.shapeFlag & 128) {
			const suspense = vnode.suspense;
			vnode = suspense.activeBranch;
			if (suspense.pendingBranch && !suspense.isHydrating) suspense.effects.push(() => {
				setVarsOnVNode(suspense.activeBranch, vars);
			});
		}
		while (vnode.component) vnode = vnode.component.subTree;
		if (vnode.shapeFlag & 1 && vnode.el) setVarsOnNode(vnode.el, vars);
		else if (vnode.type === Fragment) vnode.children.forEach((c) => setVarsOnVNode(c, vars));
		else if (vnode.type === Static) {
			let { el, anchor } = vnode;
			while (el) {
				setVarsOnNode(el, vars);
				if (el === anchor) break;
				el = el.nextSibling;
			}
		}
	}
	function setVarsOnNode(el, vars) {
		if (el.nodeType === 1) {
			const style = el.style;
			let cssText = "";
			for (const key in vars) {
				const value = normalizeCssVarValue(vars[key]);
				style.setProperty(`--${key}`, value);
				cssText += `--${key}: ${value};`;
			}
			style[CSS_VAR_TEXT] = cssText;
		}
	}
	var displayRE = /(?:^|;)\s*display\s*:/;
	function patchStyle(el, prev, next) {
		const style = el.style;
		const isCssString = isString(next);
		let hasControlledDisplay = false;
		if (next && !isCssString) {
			if (prev) if (!isString(prev)) {
				for (const key in prev) if (next[key] == null) setStyle(style, key, "");
			} else for (const prevStyle of prev.split(";")) {
				const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
				if (next[key] == null) setStyle(style, key, "");
			}
			for (const key in next) {
				if (key === "display") hasControlledDisplay = true;
				setStyle(style, key, next[key]);
			}
		} else if (isCssString) {
			if (prev !== next) {
				const cssVarText = style[CSS_VAR_TEXT];
				if (cssVarText) next += ";" + cssVarText;
				style.cssText = next;
				hasControlledDisplay = displayRE.test(next);
			}
		} else if (prev) el.removeAttribute("style");
		if (vShowOriginalDisplay in el) {
			el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
			if (el[vShowHidden]) style.display = "none";
		}
	}
	var importantRE = /\s*!important$/;
	function setStyle(style, name, val) {
		if (isArray(val)) val.forEach((v) => setStyle(style, name, v));
		else {
			if (val == null) val = "";
			if (name.startsWith("--")) style.setProperty(name, val);
			else {
				const prefixed = autoPrefix(style, name);
				if (importantRE.test(val)) style.setProperty(hyphenate$1(prefixed), val.replace(importantRE, ""), "important");
				else style[prefixed] = val;
			}
		}
	}
	var prefixes = [
		"Webkit",
		"Moz",
		"ms"
	];
	var prefixCache = {};
	function autoPrefix(style, rawName) {
		const cached = prefixCache[rawName];
		if (cached) return cached;
		let name = camelize$1(rawName);
		if (name !== "filter" && name in style) return prefixCache[rawName] = name;
		name = capitalize(name);
		for (let i = 0; i < prefixes.length; i++) {
			const prefixed = prefixes[i] + name;
			if (prefixed in style) return prefixCache[rawName] = prefixed;
		}
		return rawName;
	}
	var xlinkNS = "http://www.w3.org/1999/xlink";
	function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
		if (isSVG && key.startsWith("xlink:")) if (value == null) el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
		else el.setAttributeNS(xlinkNS, key, value);
		else if (value == null || isBoolean && !includeBooleanAttr(value)) el.removeAttribute(key);
		else el.setAttribute(key, isBoolean ? "" : isSymbol(value) ? String(value) : value);
	}
	function patchDOMProp(el, key, value, parentComponent, attrName) {
		if (key === "innerHTML" || key === "textContent") {
			if (value != null) el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
			return;
		}
		const tag = el.tagName;
		if (key === "value" && tag !== "PROGRESS" && !tag.includes("-")) {
			const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
			const newValue = value == null ? el.type === "checkbox" ? "on" : "" : String(value);
			if (oldValue !== newValue || !("_value" in el)) el.value = newValue;
			if (value == null) el.removeAttribute(key);
			el._value = value;
			return;
		}
		let needRemove = false;
		if (value === "" || value == null) {
			const type = typeof el[key];
			if (type === "boolean") value = includeBooleanAttr(value);
			else if (value == null && type === "string") {
				value = "";
				needRemove = true;
			} else if (type === "number") {
				value = 0;
				needRemove = true;
			}
		}
		try {
			el[key] = value;
		} catch (e) {}
		needRemove && el.removeAttribute(attrName || key);
	}
	function addEventListener(el, event, handler, options) {
		el.addEventListener(event, handler, options);
	}
	function removeEventListener(el, event, handler, options) {
		el.removeEventListener(event, handler, options);
	}
	var veiKey = /* @__PURE__ */ Symbol("_vei");
	function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
		const invokers = el[veiKey] || (el[veiKey] = {});
		const existingInvoker = invokers[rawName];
		if (nextValue && existingInvoker) existingInvoker.value = nextValue;
		else {
			const [name, options] = parseName(rawName);
			if (nextValue) addEventListener(el, name, invokers[rawName] = createInvoker(nextValue, instance), options);
			else if (existingInvoker) {
				removeEventListener(el, name, existingInvoker, options);
				invokers[rawName] = void 0;
			}
		}
	}
	var optionsModifierRE = /(?:Once|Passive|Capture)$/;
	function parseName(name) {
		let options;
		if (optionsModifierRE.test(name)) {
			options = {};
			let m;
			while (m = name.match(optionsModifierRE)) {
				name = name.slice(0, name.length - m[0].length);
				options[m[0].toLowerCase()] = true;
			}
		}
		return [name[2] === ":" ? name.slice(3) : hyphenate$1(name.slice(2)), options];
	}
	var cachedNow = 0;
	var p = /* @__PURE__ */ Promise.resolve();
	var getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
	function createInvoker(initialValue, instance) {
		const invoker = (e) => {
			if (!e._vts) e._vts = Date.now();
			else if (e._vts <= invoker.attached) return;
			callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
		};
		invoker.value = initialValue;
		invoker.attached = getNow();
		return invoker;
	}
	function patchStopImmediatePropagation(e, value) {
		if (isArray(value)) {
			const originalStop = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				originalStop.call(e);
				e._stopped = true;
			};
			return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
		} else return value;
	}
	var isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
	var patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
		const isSVG = namespace === "svg";
		if (key === "class") patchClass(el, nextValue, isSVG);
		else if (key === "style") patchStyle(el, prevValue, nextValue);
		else if (isOn(key)) {
			if (!isModelListener(key)) patchEvent(el, key, prevValue, nextValue, parentComponent);
		} else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
			patchDOMProp(el, key, nextValue);
			if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
		} else if (el._isVueCE && (shouldSetAsPropForVueCE(el, key) || el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))) patchDOMProp(el, camelize$1(key), nextValue, parentComponent, key);
		else {
			if (key === "true-value") el._trueValue = nextValue;
			else if (key === "false-value") el._falseValue = nextValue;
			patchAttr(el, key, nextValue, isSVG);
		}
	};
	function shouldSetAsProp(el, key, value, isSVG) {
		if (isSVG) {
			if (key === "innerHTML" || key === "textContent") return true;
			if (key in el && isNativeOn(key) && isFunction(value)) return true;
			return false;
		}
		if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") return false;
		if (key === "sandbox" && el.tagName === "IFRAME") return false;
		if (key === "form") return false;
		if (key === "list" && el.tagName === "INPUT") return false;
		if (key === "type" && el.tagName === "TEXTAREA") return false;
		if (key === "width" || key === "height") {
			const tag = el.tagName;
			if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") return false;
		}
		if (isNativeOn(key) && isString(value)) return false;
		return key in el;
	}
	function shouldSetAsPropForVueCE(el, key) {
		const props = el._def.props;
		if (!props) return false;
		const camelKey = camelize$1(key);
		return Array.isArray(props) ? props.some((prop) => camelize$1(prop) === camelKey) : Object.keys(props).some((prop) => camelize$1(prop) === camelKey);
	}
	var REMOVAL = {};
	/* @__NO_SIDE_EFFECTS__ */
	function defineCustomElement(options, extraOptions, _createApp) {
		let Comp = /* @__PURE__ */ defineComponent(options, extraOptions);
		if (isPlainObject$2(Comp)) Comp = extend({}, Comp, extraOptions);
		class VueCustomElement extends VueElement {
			constructor(initialProps) {
				super(Comp, initialProps, _createApp);
			}
		}
		VueCustomElement.def = Comp;
		return VueCustomElement;
	}
	var defineSSRCustomElement = /* @__NO_SIDE_EFFECTS__ */ ((options, extraOptions) => {
		return /* @__PURE__ */ defineCustomElement(options, extraOptions, createSSRApp);
	});
	var BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {};
	var VueElement = class VueElement extends BaseClass {
		constructor(_def, _props = {}, _createApp = createApp) {
			super();
			this._def = _def;
			this._props = _props;
			this._createApp = _createApp;
			this._isVueCE = true;
			/**
			* @internal
			*/
			this._instance = null;
			/**
			* @internal
			*/
			this._app = null;
			/**
			* @internal
			*/
			this._nonce = this._def.nonce;
			this._connected = false;
			this._resolved = false;
			this._patching = false;
			this._dirty = false;
			this._numberProps = null;
			this._styleChildren = /* @__PURE__ */ new WeakSet();
			this._styleAnchors = /* @__PURE__ */ new WeakMap();
			this._ob = null;
			if (this.shadowRoot && _createApp !== createApp) this._root = this.shadowRoot;
			else if (_def.shadowRoot !== false) {
				this.attachShadow(extend({}, _def.shadowRootOptions, { mode: "open" }));
				this._root = this.shadowRoot;
			} else this._root = this;
		}
		connectedCallback() {
			if (!this.isConnected) return;
			if (!this.shadowRoot && !this._resolved) this._parseSlots();
			this._connected = true;
			let parent = this;
			while (parent = parent && (parent.assignedSlot || parent.parentNode || parent.host)) if (parent instanceof VueElement) {
				this._parent = parent;
				break;
			}
			if (!this._instance) if (this._resolved) this._mount(this._def);
			else if (parent && parent._pendingResolve) this._pendingResolve = parent._pendingResolve.then(() => {
				this._pendingResolve = void 0;
				this._resolveDef();
			});
			else this._resolveDef();
		}
		_setParent(parent = this._parent) {
			if (parent) {
				this._instance.parent = parent._instance;
				this._inheritParentContext(parent);
			}
		}
		_inheritParentContext(parent = this._parent) {
			if (parent && this._app) Object.setPrototypeOf(this._app._context.provides, parent._instance.provides);
		}
		disconnectedCallback() {
			this._connected = false;
			nextTick(() => {
				if (!this._connected) {
					if (this._ob) {
						this._ob.disconnect();
						this._ob = null;
					}
					this._app && this._app.unmount();
					if (this._instance) this._instance.ce = void 0;
					this._app = this._instance = null;
					if (this._teleportTargets) {
						this._teleportTargets.clear();
						this._teleportTargets = void 0;
					}
				}
			});
		}
		_processMutations(mutations) {
			for (const m of mutations) this._setAttr(m.attributeName);
		}
		/**
		* resolve inner component definition (handle possible async component)
		*/
		_resolveDef() {
			if (this._pendingResolve) return;
			for (let i = 0; i < this.attributes.length; i++) this._setAttr(this.attributes[i].name);
			this._ob = new MutationObserver(this._processMutations.bind(this));
			this._ob.observe(this, { attributes: true });
			const resolve = (def, isAsync = false) => {
				this._resolved = true;
				this._pendingResolve = void 0;
				const { props, styles } = def;
				let numberProps;
				if (props && !isArray(props)) for (const key in props) {
					const opt = props[key];
					if (opt === Number || opt && opt.type === Number) {
						if (key in this._props) this._props[key] = toNumber(this._props[key]);
						(numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[camelize$1(key)] = true;
					}
				}
				this._numberProps = numberProps;
				this._resolveProps(def);
				if (this.shadowRoot) this._applyStyles(styles);
				this._mount(def);
			};
			const asyncDef = this._def.__asyncLoader;
			if (asyncDef) this._pendingResolve = asyncDef().then((def) => {
				def.configureApp = this._def.configureApp;
				resolve(this._def = def, true);
			});
			else resolve(this._def);
		}
		_mount(def) {
			this._app = this._createApp(def);
			this._inheritParentContext();
			if (def.configureApp) def.configureApp(this._app);
			this._app._ceVNode = this._createVNode();
			this._app.mount(this._root);
			const exposed = this._instance && this._instance.exposed;
			if (!exposed) return;
			for (const key in exposed) if (!hasOwn(this, key)) Object.defineProperty(this, key, { get: () => unref(exposed[key]) });
		}
		_resolveProps(def) {
			const { props } = def;
			const declaredPropKeys = isArray(props) ? props : Object.keys(props || {});
			for (const key of Object.keys(this)) if (key[0] !== "_" && declaredPropKeys.includes(key)) this._setProp(key, this[key]);
			for (const key of declaredPropKeys.map(camelize$1)) Object.defineProperty(this, key, {
				get() {
					return this._getProp(key);
				},
				set(val) {
					this._setProp(key, val, true, !this._patching);
				}
			});
		}
		_setAttr(key) {
			if (key.startsWith("data-v-")) return;
			const has = this.hasAttribute(key);
			let value = has ? this.getAttribute(key) : REMOVAL;
			const camelKey = camelize$1(key);
			if (has && this._numberProps && this._numberProps[camelKey]) value = toNumber(value);
			this._setProp(camelKey, value, false, true);
		}
		/**
		* @internal
		*/
		_getProp(key) {
			return this._props[key];
		}
		/**
		* @internal
		*/
		_setProp(key, val, shouldReflect = true, shouldUpdate = false) {
			if (val !== this._props[key]) {
				this._dirty = true;
				if (val === REMOVAL) delete this._props[key];
				else {
					this._props[key] = val;
					if (key === "key" && this._app) this._app._ceVNode.key = val;
				}
				if (shouldUpdate && this._instance) this._update();
				if (shouldReflect) {
					const ob = this._ob;
					if (ob) {
						this._processMutations(ob.takeRecords());
						ob.disconnect();
					}
					if (val === true) this.setAttribute(hyphenate$1(key), "");
					else if (typeof val === "string" || typeof val === "number") this.setAttribute(hyphenate$1(key), val + "");
					else if (!val) this.removeAttribute(hyphenate$1(key));
					ob && ob.observe(this, { attributes: true });
				}
			}
		}
		_update() {
			const vnode = this._createVNode();
			if (this._app) vnode.appContext = this._app._context;
			render(vnode, this._root);
		}
		_createVNode() {
			const baseProps = {};
			if (!this.shadowRoot) baseProps.onVnodeMounted = baseProps.onVnodeUpdated = this._renderSlots.bind(this);
			const vnode = createVNode(this._def, extend(baseProps, this._props));
			if (!this._instance) vnode.ce = (instance) => {
				this._instance = instance;
				instance.ce = this;
				instance.isCE = true;
				const dispatch = (event, args) => {
					this.dispatchEvent(new CustomEvent(event, isPlainObject$2(args[0]) ? extend({ detail: args }, args[0]) : { detail: args }));
				};
				instance.emit = (event, ...args) => {
					dispatch(event, args);
					if (hyphenate$1(event) !== event) dispatch(hyphenate$1(event), args);
				};
				this._setParent();
			};
			return vnode;
		}
		_applyStyles(styles, owner, parentComp) {
			if (!styles) return;
			if (owner) {
				if (owner === this._def || this._styleChildren.has(owner)) return;
				this._styleChildren.add(owner);
			}
			const nonce = this._nonce;
			const root = this.shadowRoot;
			const insertionAnchor = parentComp ? this._getStyleAnchor(parentComp) || this._getStyleAnchor(this._def) : this._getRootStyleInsertionAnchor(root);
			let last = null;
			for (let i = styles.length - 1; i >= 0; i--) {
				const s = document.createElement("style");
				if (nonce) s.setAttribute("nonce", nonce);
				s.textContent = styles[i];
				root.insertBefore(s, last || insertionAnchor);
				last = s;
				if (i === 0) {
					if (!parentComp) this._styleAnchors.set(this._def, s);
					if (owner) this._styleAnchors.set(owner, s);
				}
			}
		}
		_getStyleAnchor(comp) {
			if (!comp) return null;
			const anchor = this._styleAnchors.get(comp);
			if (anchor && anchor.parentNode === this.shadowRoot) return anchor;
			if (anchor) this._styleAnchors.delete(comp);
			return null;
		}
		_getRootStyleInsertionAnchor(root) {
			for (let i = 0; i < root.childNodes.length; i++) {
				const node = root.childNodes[i];
				if (!(node instanceof HTMLStyleElement)) return node;
			}
			return null;
		}
		/**
		* Only called when shadowRoot is false
		*/
		_parseSlots() {
			const slots = this._slots = {};
			let n;
			while (n = this.firstChild) {
				const slotName = n.nodeType === 1 && n.getAttribute("slot") || "default";
				(slots[slotName] || (slots[slotName] = [])).push(n);
				this.removeChild(n);
			}
		}
		/**
		* Only called when shadowRoot is false
		*/
		_renderSlots() {
			const outlets = this._getSlots();
			const scopeId = this._instance.type.__scopeId;
			for (let i = 0; i < outlets.length; i++) {
				const o = outlets[i];
				const slotName = o.getAttribute("name") || "default";
				const content = this._slots[slotName];
				const parent = o.parentNode;
				if (content) for (const n of content) {
					if (scopeId && n.nodeType === 1) {
						const id = scopeId + "-s";
						const walker = document.createTreeWalker(n, 1);
						n.setAttribute(id, "");
						let child;
						while (child = walker.nextNode()) child.setAttribute(id, "");
					}
					parent.insertBefore(n, o);
				}
				else while (o.firstChild) parent.insertBefore(o.firstChild, o);
				parent.removeChild(o);
			}
		}
		/**
		* @internal
		*/
		_getSlots() {
			const roots = [this];
			if (this._teleportTargets) roots.push(...this._teleportTargets);
			const slots = /* @__PURE__ */ new Set();
			for (const root of roots) {
				const found = root.querySelectorAll("slot");
				for (let i = 0; i < found.length; i++) slots.add(found[i]);
			}
			return Array.from(slots);
		}
		/**
		* @internal
		*/
		_injectChildStyle(comp, parentComp) {
			this._applyStyles(comp.styles, comp, parentComp);
		}
		/**
		* @internal
		*/
		_beginPatch() {
			this._patching = true;
			this._dirty = false;
		}
		/**
		* @internal
		*/
		_endPatch() {
			this._patching = false;
			if (this._dirty && this._instance) this._update();
		}
		/**
		* @internal
		*/
		_hasShadowRoot() {
			return this._def.shadowRoot !== false;
		}
		/**
		* @internal
		*/
		_removeChildStyle(comp) {}
	};
	function useHost(caller) {
		const instance = getCurrentInstance();
		const el = instance && instance.ce;
		if (el) return el;
		return null;
	}
	function useShadowRoot() {
		const el = useHost();
		return el && el.shadowRoot;
	}
	function useCssModule(name = "$style") {
		{
			const instance = getCurrentInstance();
			if (!instance) return EMPTY_OBJ;
			const modules = instance.type.__cssModules;
			if (!modules) return EMPTY_OBJ;
			const mod = modules[name];
			if (!mod) return EMPTY_OBJ;
			return mod;
		}
	}
	var positionMap = /* @__PURE__ */ new WeakMap();
	var newPositionMap = /* @__PURE__ */ new WeakMap();
	var moveCbKey = /* @__PURE__ */ Symbol("_moveCb");
	var enterCbKey = /* @__PURE__ */ Symbol("_enterCb");
	var decorate = (t) => {
		delete t.props.mode;
		return t;
	};
	var TransitionGroup = /* @__PURE__ */ decorate({
		name: "TransitionGroup",
		props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
			tag: String,
			moveClass: String
		}),
		setup(props, { slots }) {
			const instance = getCurrentInstance();
			const state = useTransitionState();
			let prevChildren;
			let children;
			onUpdated(() => {
				if (!prevChildren.length) return;
				const moveClass = props.moveClass || `${props.name || "v"}-move`;
				if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
					prevChildren = [];
					return;
				}
				prevChildren.forEach(callPendingCbs);
				prevChildren.forEach(recordPosition);
				const movedChildren = prevChildren.filter(applyTranslation);
				forceReflow(instance.vnode.el);
				movedChildren.forEach((c) => {
					const el = c.el;
					const style = el.style;
					addTransitionClass(el, moveClass);
					style.transform = style.webkitTransform = style.transitionDuration = "";
					const cb = el[moveCbKey] = (e) => {
						if (e && e.target !== el) return;
						if (!e || e.propertyName.endsWith("transform")) {
							el.removeEventListener("transitionend", cb);
							el[moveCbKey] = null;
							removeTransitionClass(el, moveClass);
						}
					};
					el.addEventListener("transitionend", cb);
				});
				prevChildren = [];
			});
			return () => {
				const rawProps = /* @__PURE__ */ toRaw(props);
				const cssTransitionProps = resolveTransitionProps(rawProps);
				let tag = rawProps.tag || Fragment;
				prevChildren = [];
				if (children) for (let i = 0; i < children.length; i++) {
					const child = children[i];
					if (child.el && child.el instanceof Element) {
						prevChildren.push(child);
						setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
						positionMap.set(child, getPosition(child.el));
					}
				}
				children = slots.default ? getTransitionRawChildren(slots.default()) : [];
				for (let i = 0; i < children.length; i++) {
					const child = children[i];
					if (child.key != null) setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
				}
				return createVNode(tag, null, children);
			};
		}
	});
	function callPendingCbs(c) {
		const el = c.el;
		if (el[moveCbKey]) el[moveCbKey]();
		if (el[enterCbKey]) el[enterCbKey]();
	}
	function recordPosition(c) {
		newPositionMap.set(c, getPosition(c.el));
	}
	function applyTranslation(c) {
		const oldPos = positionMap.get(c);
		const newPos = newPositionMap.get(c);
		const dx = oldPos.left - newPos.left;
		const dy = oldPos.top - newPos.top;
		if (dx || dy) {
			const el = c.el;
			const s = el.style;
			const rect = el.getBoundingClientRect();
			let scaleX = 1;
			let scaleY = 1;
			if (el.offsetWidth) scaleX = rect.width / el.offsetWidth;
			if (el.offsetHeight) scaleY = rect.height / el.offsetHeight;
			if (!Number.isFinite(scaleX) || scaleX === 0) scaleX = 1;
			if (!Number.isFinite(scaleY) || scaleY === 0) scaleY = 1;
			if (Math.abs(scaleX - 1) < .01) scaleX = 1;
			if (Math.abs(scaleY - 1) < .01) scaleY = 1;
			s.transform = s.webkitTransform = `translate(${dx / scaleX}px,${dy / scaleY}px)`;
			s.transitionDuration = "0s";
			return c;
		}
	}
	function getPosition(el) {
		const rect = el.getBoundingClientRect();
		return {
			left: rect.left,
			top: rect.top
		};
	}
	function hasCSSTransform(el, root, moveClass) {
		const clone = el.cloneNode();
		const _vtc = el[vtcKey];
		if (_vtc) _vtc.forEach((cls) => {
			cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
		});
		moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
		clone.style.display = "none";
		const container = root.nodeType === 1 ? root : root.parentNode;
		container.appendChild(clone);
		const { hasTransform } = getTransitionInfo(clone);
		container.removeChild(clone);
		return hasTransform;
	}
	var getModelAssigner = (vnode) => {
		const fn = vnode.props["onUpdate:modelValue"] || false;
		return isArray(fn) ? (value) => invokeArrayFns(fn, value) : fn;
	};
	function onCompositionStart(e) {
		e.target.composing = true;
	}
	function onCompositionEnd(e) {
		const target = e.target;
		if (target.composing) {
			target.composing = false;
			target.dispatchEvent(new Event("input"));
		}
	}
	var assignKey = /* @__PURE__ */ Symbol("_assign");
	function castValue(value, trim, number) {
		if (trim) value = value.trim();
		if (number) value = looseToNumber(value);
		return value;
	}
	var vModelText = {
		created(el, { modifiers: { lazy, trim, number } }, vnode) {
			el[assignKey] = getModelAssigner(vnode);
			const castToNumber = number || vnode.props && vnode.props.type === "number";
			addEventListener(el, lazy ? "change" : "input", (e) => {
				if (e.target.composing) return;
				el[assignKey](castValue(el.value, trim, castToNumber));
			});
			if (trim || castToNumber) addEventListener(el, "change", () => {
				el.value = castValue(el.value, trim, castToNumber);
			});
			if (!lazy) {
				addEventListener(el, "compositionstart", onCompositionStart);
				addEventListener(el, "compositionend", onCompositionEnd);
				addEventListener(el, "change", onCompositionEnd);
			}
		},
		mounted(el, { value }) {
			el.value = value == null ? "" : value;
		},
		beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
			el[assignKey] = getModelAssigner(vnode);
			if (el.composing) return;
			const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
			const newValue = value == null ? "" : value;
			if (elValue === newValue) return;
			const rootNode = el.getRootNode();
			if ((rootNode instanceof Document || rootNode instanceof ShadowRoot) && rootNode.activeElement === el && el.type !== "range") {
				if (lazy && value === oldValue) return;
				if (trim && el.value.trim() === newValue) return;
			}
			el.value = newValue;
		}
	};
	var vModelCheckbox = {
		deep: true,
		created(el, _, vnode) {
			el[assignKey] = getModelAssigner(vnode);
			addEventListener(el, "change", () => {
				const modelValue = el._modelValue;
				const elementValue = getValue(el);
				const checked = el.checked;
				const assign = el[assignKey];
				if (isArray(modelValue)) {
					const index = looseIndexOf(modelValue, elementValue);
					const found = index !== -1;
					if (checked && !found) assign(modelValue.concat(elementValue));
					else if (!checked && found) {
						const filtered = [...modelValue];
						filtered.splice(index, 1);
						assign(filtered);
					}
				} else if (isSet(modelValue)) {
					const cloned = new Set(modelValue);
					if (checked) cloned.add(elementValue);
					else cloned.delete(elementValue);
					assign(cloned);
				} else assign(getCheckboxValue(el, checked));
			});
		},
		mounted: setChecked,
		beforeUpdate(el, binding, vnode) {
			el[assignKey] = getModelAssigner(vnode);
			setChecked(el, binding, vnode);
		}
	};
	function setChecked(el, { value, oldValue }, vnode) {
		el._modelValue = value;
		let checked;
		if (isArray(value)) checked = looseIndexOf(value, vnode.props.value) > -1;
		else if (isSet(value)) checked = value.has(vnode.props.value);
		else {
			if (value === oldValue) return;
			checked = looseEqual(value, getCheckboxValue(el, true));
		}
		if (el.checked !== checked) el.checked = checked;
	}
	var vModelRadio = {
		created(el, { value }, vnode) {
			el.checked = looseEqual(value, vnode.props.value);
			el[assignKey] = getModelAssigner(vnode);
			addEventListener(el, "change", () => {
				el[assignKey](getValue(el));
			});
		},
		beforeUpdate(el, { value, oldValue }, vnode) {
			el[assignKey] = getModelAssigner(vnode);
			if (value !== oldValue) el.checked = looseEqual(value, vnode.props.value);
		}
	};
	var vModelSelect = {
		deep: true,
		created(el, { value, modifiers: { number } }, vnode) {
			const isSetModel = isSet(value);
			addEventListener(el, "change", () => {
				const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map((o) => number ? looseToNumber(getValue(o)) : getValue(o));
				el[assignKey](el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]);
				el._assigning = true;
				nextTick(() => {
					el._assigning = false;
				});
			});
			el[assignKey] = getModelAssigner(vnode);
		},
		mounted(el, { value }) {
			setSelected(el, value);
		},
		beforeUpdate(el, _binding, vnode) {
			el[assignKey] = getModelAssigner(vnode);
		},
		updated(el, { value }) {
			if (!el._assigning) setSelected(el, value);
		}
	};
	function setSelected(el, value) {
		const isMultiple = el.multiple;
		const isArrayValue = isArray(value);
		if (isMultiple && !isArrayValue && !isSet(value)) return;
		for (let i = 0, l = el.options.length; i < l; i++) {
			const option = el.options[i];
			const optionValue = getValue(option);
			if (isMultiple) if (isArrayValue) {
				const optionType = typeof optionValue;
				if (optionType === "string" || optionType === "number") option.selected = value.some((v) => String(v) === String(optionValue));
				else option.selected = looseIndexOf(value, optionValue) > -1;
			} else option.selected = value.has(optionValue);
			else if (looseEqual(getValue(option), value)) {
				if (el.selectedIndex !== i) el.selectedIndex = i;
				return;
			}
		}
		if (!isMultiple && el.selectedIndex !== -1) el.selectedIndex = -1;
	}
	function getValue(el) {
		return "_value" in el ? el._value : el.value;
	}
	function getCheckboxValue(el, checked) {
		const key = checked ? "_trueValue" : "_falseValue";
		return key in el ? el[key] : checked;
	}
	var vModelDynamic = {
		created(el, binding, vnode) {
			callModelHook(el, binding, vnode, null, "created");
		},
		mounted(el, binding, vnode) {
			callModelHook(el, binding, vnode, null, "mounted");
		},
		beforeUpdate(el, binding, vnode, prevVNode) {
			callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
		},
		updated(el, binding, vnode, prevVNode) {
			callModelHook(el, binding, vnode, prevVNode, "updated");
		}
	};
	function resolveDynamicModel(tagName, type) {
		switch (tagName) {
			case "SELECT": return vModelSelect;
			case "TEXTAREA": return vModelText;
			default: switch (type) {
				case "checkbox": return vModelCheckbox;
				case "radio": return vModelRadio;
				default: return vModelText;
			}
		}
	}
	function callModelHook(el, binding, vnode, prevVNode, hook) {
		const fn = resolveDynamicModel(el.tagName, vnode.props && vnode.props.type)[hook];
		fn && fn(el, binding, vnode, prevVNode);
	}
	function initVModelForSSR() {
		vModelText.getSSRProps = ({ value }) => ({ value });
		vModelRadio.getSSRProps = ({ value }, vnode) => {
			if (vnode.props && looseEqual(vnode.props.value, value)) return { checked: true };
		};
		vModelCheckbox.getSSRProps = ({ value }, vnode) => {
			if (isArray(value)) {
				if (vnode.props && looseIndexOf(value, vnode.props.value) > -1) return { checked: true };
			} else if (isSet(value)) {
				if (vnode.props && value.has(vnode.props.value)) return { checked: true };
			} else if (value) return { checked: true };
		};
		vModelDynamic.getSSRProps = (binding, vnode) => {
			if (typeof vnode.type !== "string") return;
			const modelToUse = resolveDynamicModel(vnode.type.toUpperCase(), vnode.props && vnode.props.type);
			if (modelToUse.getSSRProps) return modelToUse.getSSRProps(binding, vnode);
		};
	}
	var systemModifiers = [
		"ctrl",
		"shift",
		"alt",
		"meta"
	];
	var modifierGuards = {
		stop: (e) => e.stopPropagation(),
		prevent: (e) => e.preventDefault(),
		self: (e) => e.target !== e.currentTarget,
		ctrl: (e) => !e.ctrlKey,
		shift: (e) => !e.shiftKey,
		alt: (e) => !e.altKey,
		meta: (e) => !e.metaKey,
		left: (e) => "button" in e && e.button !== 0,
		middle: (e) => "button" in e && e.button !== 1,
		right: (e) => "button" in e && e.button !== 2,
		exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
	};
	var withModifiers = (fn, modifiers) => {
		if (!fn) return fn;
		const cache = fn._withMods || (fn._withMods = {});
		const cacheKey = modifiers.join(".");
		return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
			for (let i = 0; i < modifiers.length; i++) {
				const guard = modifierGuards[modifiers[i]];
				if (guard && guard(event, modifiers)) return;
			}
			return fn(event, ...args);
		}));
	};
	var keyNames = {
		esc: "escape",
		space: " ",
		up: "arrow-up",
		left: "arrow-left",
		right: "arrow-right",
		down: "arrow-down",
		delete: "backspace"
	};
	var withKeys = (fn, modifiers) => {
		const cache = fn._withKeys || (fn._withKeys = {});
		const cacheKey = modifiers.join(".");
		return cache[cacheKey] || (cache[cacheKey] = ((event) => {
			if (!("key" in event)) return;
			const eventKey = hyphenate$1(event.key);
			if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) return fn(event);
		}));
	};
	var rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
	var renderer;
	var enabledHydration = false;
	function ensureRenderer() {
		return renderer || (renderer = createRenderer(rendererOptions));
	}
	function ensureHydrationRenderer() {
		renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
		enabledHydration = true;
		return renderer;
	}
	var render = ((...args) => {
		ensureRenderer().render(...args);
	});
	var hydrate = ((...args) => {
		ensureHydrationRenderer().hydrate(...args);
	});
	var createApp = ((...args) => {
		const app = ensureRenderer().createApp(...args);
		const { mount } = app;
		app.mount = (containerOrSelector) => {
			const container = normalizeContainer(containerOrSelector);
			if (!container) return;
			const component = app._component;
			if (!isFunction(component) && !component.render && !component.template) component.template = container.innerHTML;
			if (container.nodeType === 1) container.textContent = "";
			const proxy = mount(container, false, resolveRootNamespace(container));
			if (container instanceof Element) {
				container.removeAttribute("v-cloak");
				container.setAttribute("data-v-app", "");
			}
			return proxy;
		};
		return app;
	});
	var createSSRApp = ((...args) => {
		const app = ensureHydrationRenderer().createApp(...args);
		const { mount } = app;
		app.mount = (containerOrSelector) => {
			const container = normalizeContainer(containerOrSelector);
			if (container) return mount(container, true, resolveRootNamespace(container));
		};
		return app;
	});
	function resolveRootNamespace(container) {
		if (container instanceof SVGElement) return "svg";
		if (typeof MathMLElement === "function" && container instanceof MathMLElement) return "mathml";
	}
	function normalizeContainer(container) {
		if (isString(container)) return document.querySelector(container);
		return container;
	}
	var ssrDirectiveInitialized = false;
	var initDirectivesForSSR = () => {
		if (!ssrDirectiveInitialized) {
			ssrDirectiveInitialized = true;
			initVModelForSSR();
			initVShowForSSR();
		}
	};
	//#endregion
	//#region node_modules/.pnpm/vue@3.5.32_typescript@6.0.2/node_modules/vue/dist/vue.runtime.esm-bundler.js
	var vue_runtime_esm_bundler_exports = /* @__PURE__ */ __exportAll({
		BaseTransition: () => BaseTransition,
		BaseTransitionPropsValidators: () => BaseTransitionPropsValidators,
		Comment: () => Comment,
		DeprecationTypes: () => null,
		EffectScope: () => EffectScope,
		ErrorCodes: () => ErrorCodes,
		ErrorTypeStrings: () => ErrorTypeStrings,
		Fragment: () => Fragment,
		KeepAlive: () => KeepAlive,
		ReactiveEffect: () => ReactiveEffect,
		Static: () => Static,
		Suspense: () => Suspense,
		Teleport: () => Teleport,
		Text: () => Text,
		TrackOpTypes: () => TrackOpTypes,
		Transition: () => Transition,
		TransitionGroup: () => TransitionGroup,
		TriggerOpTypes: () => TriggerOpTypes,
		VueElement: () => VueElement,
		assertNumber: () => assertNumber,
		callWithAsyncErrorHandling: () => callWithAsyncErrorHandling,
		callWithErrorHandling: () => callWithErrorHandling,
		camelize: () => camelize$1,
		capitalize: () => capitalize,
		cloneVNode: () => cloneVNode,
		compatUtils: () => null,
		compile: () => compile,
		computed: () => computed,
		createApp: () => createApp,
		createBlock: () => createBlock,
		createCommentVNode: () => createCommentVNode,
		createElementBlock: () => createElementBlock,
		createElementVNode: () => createBaseVNode,
		createHydrationRenderer: () => createHydrationRenderer,
		createPropsRestProxy: () => createPropsRestProxy,
		createRenderer: () => createRenderer,
		createSSRApp: () => createSSRApp,
		createSlots: () => createSlots,
		createStaticVNode: () => createStaticVNode,
		createTextVNode: () => createTextVNode,
		createVNode: () => createVNode,
		customRef: () => customRef,
		defineAsyncComponent: () => defineAsyncComponent,
		defineComponent: () => defineComponent,
		defineCustomElement: () => defineCustomElement,
		defineEmits: () => defineEmits,
		defineExpose: () => defineExpose,
		defineModel: () => defineModel,
		defineOptions: () => defineOptions,
		defineProps: () => defineProps,
		defineSSRCustomElement: () => defineSSRCustomElement,
		defineSlots: () => defineSlots,
		devtools: () => devtools,
		effect: () => effect,
		effectScope: () => effectScope,
		getCurrentInstance: () => getCurrentInstance,
		getCurrentScope: () => getCurrentScope,
		getCurrentWatcher: () => getCurrentWatcher,
		getTransitionRawChildren: () => getTransitionRawChildren,
		guardReactiveProps: () => guardReactiveProps,
		h: () => h,
		handleError: () => handleError,
		hasInjectionContext: () => hasInjectionContext,
		hydrate: () => hydrate,
		hydrateOnIdle: () => hydrateOnIdle,
		hydrateOnInteraction: () => hydrateOnInteraction,
		hydrateOnMediaQuery: () => hydrateOnMediaQuery,
		hydrateOnVisible: () => hydrateOnVisible,
		initCustomFormatter: () => initCustomFormatter,
		initDirectivesForSSR: () => initDirectivesForSSR,
		inject: () => inject,
		isMemoSame: () => isMemoSame,
		isProxy: () => isProxy,
		isReactive: () => isReactive,
		isReadonly: () => isReadonly,
		isRef: () => isRef,
		isRuntimeOnly: () => isRuntimeOnly,
		isShallow: () => isShallow,
		isVNode: () => isVNode,
		markRaw: () => markRaw,
		mergeDefaults: () => mergeDefaults,
		mergeModels: () => mergeModels,
		mergeProps: () => mergeProps,
		nextTick: () => nextTick,
		nodeOps: () => nodeOps,
		normalizeClass: () => normalizeClass,
		normalizeProps: () => normalizeProps,
		normalizeStyle: () => normalizeStyle,
		onActivated: () => onActivated,
		onBeforeMount: () => onBeforeMount,
		onBeforeUnmount: () => onBeforeUnmount,
		onBeforeUpdate: () => onBeforeUpdate,
		onDeactivated: () => onDeactivated,
		onErrorCaptured: () => onErrorCaptured,
		onMounted: () => onMounted,
		onRenderTracked: () => onRenderTracked,
		onRenderTriggered: () => onRenderTriggered,
		onScopeDispose: () => onScopeDispose,
		onServerPrefetch: () => onServerPrefetch,
		onUnmounted: () => onUnmounted,
		onUpdated: () => onUpdated,
		onWatcherCleanup: () => onWatcherCleanup,
		openBlock: () => openBlock,
		patchProp: () => patchProp,
		popScopeId: () => popScopeId,
		provide: () => provide,
		proxyRefs: () => proxyRefs,
		pushScopeId: () => pushScopeId,
		queuePostFlushCb: () => queuePostFlushCb,
		reactive: () => reactive,
		readonly: () => readonly,
		ref: () => ref,
		registerRuntimeCompiler: () => registerRuntimeCompiler,
		render: () => render,
		renderList: () => renderList,
		renderSlot: () => renderSlot,
		resolveComponent: () => resolveComponent,
		resolveDirective: () => resolveDirective,
		resolveDynamicComponent: () => resolveDynamicComponent,
		resolveFilter: () => null,
		resolveTransitionHooks: () => resolveTransitionHooks,
		setBlockTracking: () => setBlockTracking,
		setDevtoolsHook: () => setDevtoolsHook,
		setTransitionHooks: () => setTransitionHooks,
		shallowReactive: () => shallowReactive,
		shallowReadonly: () => shallowReadonly,
		shallowRef: () => shallowRef,
		ssrContextKey: () => ssrContextKey,
		ssrUtils: () => ssrUtils,
		stop: () => stop,
		toDisplayString: () => toDisplayString,
		toHandlerKey: () => toHandlerKey,
		toHandlers: () => toHandlers,
		toRaw: () => toRaw,
		toRef: () => toRef$1,
		toRefs: () => toRefs,
		toValue: () => toValue,
		transformVNodeArgs: () => transformVNodeArgs,
		triggerRef: () => triggerRef,
		unref: () => unref,
		useAttrs: () => useAttrs,
		useCssModule: () => useCssModule,
		useCssVars: () => useCssVars,
		useHost: () => useHost,
		useId: () => useId$1,
		useModel: () => useModel,
		useSSRContext: () => useSSRContext,
		useShadowRoot: () => useShadowRoot,
		useSlots: () => useSlots,
		useTemplateRef: () => useTemplateRef,
		useTransitionState: () => useTransitionState,
		vModelCheckbox: () => vModelCheckbox,
		vModelDynamic: () => vModelDynamic,
		vModelRadio: () => vModelRadio,
		vModelSelect: () => vModelSelect,
		vModelText: () => vModelText,
		vShow: () => vShow,
		version: () => version,
		warn: () => warn,
		watch: () => watch,
		watchEffect: () => watchEffect,
		watchPostEffect: () => watchPostEffect,
		watchSyncEffect: () => watchSyncEffect,
		withAsyncContext: () => withAsyncContext,
		withCtx: () => withCtx,
		withDefaults: () => withDefaults,
		withDirectives: () => withDirectives,
		withKeys: () => withKeys,
		withMemo: () => withMemo,
		withModifiers: () => withModifiers,
		withScopeId: () => withScopeId
	});
	var compile = () => {};
	//#endregion
	//#region node_modules/.pnpm/@vueuse+shared@14.2.1_vue@3.5.32_typescript@6.0.2_/node_modules/@vueuse/shared/dist/index.js
	/**
	* Call onScopeDispose() if it's inside an effect scope lifecycle, if not, do nothing
	*
	* @param fn
	*/
	function tryOnScopeDispose(fn, failSilently) {
		if (getCurrentScope()) {
			onScopeDispose(fn, failSilently);
			return true;
		}
		return false;
	}
	/**
	* Keep states in the global scope to be reusable across Vue instances.
	*
	* @see https://vueuse.org/createGlobalState
	* @param stateFactory A factory function to create the state
	*
	* @__NO_SIDE_EFFECTS__
	*/
	function createGlobalState(stateFactory) {
		let initialized = false;
		let state;
		const scope = effectScope(true);
		return ((...args) => {
			if (!initialized) {
				state = scope.run(() => stateFactory(...args));
				initialized = true;
			}
			return state;
		});
	}
	var isClient = typeof window !== "undefined" && typeof document !== "undefined";
	typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
	var isDef = (val) => typeof val !== "undefined";
	var notNullish = (val) => val != null;
	var toString = Object.prototype.toString;
	var isObject = (val) => toString.call(val) === "[object Object]";
	var noop = () => {};
	var isIOS = /* @__PURE__ */ getIsIOS();
	function getIsIOS() {
		var _window, _window2, _window3;
		return isClient && !!((_window = window) === null || _window === void 0 || (_window = _window.navigator) === null || _window === void 0 ? void 0 : _window.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((_window2 = window) === null || _window2 === void 0 || (_window2 = _window2.navigator) === null || _window2 === void 0 ? void 0 : _window2.maxTouchPoints) > 2 && /iPad|Macintosh/.test((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.navigator.userAgent));
	}
	function toRef(...args) {
		if (args.length !== 1) return /* @__PURE__ */ toRef$1(...args);
		const r = args[0];
		return typeof r === "function" ? /* @__PURE__ */ readonly(customRef(() => ({
			get: r,
			set: noop
		}))) : /* @__PURE__ */ ref(r);
	}
	/**
	* @internal
	*/
	function createFilterWrapper(filter, fn) {
		function wrapper(...args) {
			return new Promise((resolve, reject) => {
				Promise.resolve(filter(() => fn.apply(this, args), {
					fn,
					thisArg: this,
					args
				})).then(resolve).catch(reject);
			});
		}
		return wrapper;
	}
	var bypassFilter = (invoke$1) => {
		return invoke$1();
	};
	/**
	* Create an EventFilter that debounce the events
	*/
	function debounceFilter(ms, options = {}) {
		let timer;
		let maxTimer;
		let lastRejector = noop;
		const _clearTimeout = (timer$1) => {
			clearTimeout(timer$1);
			lastRejector();
			lastRejector = noop;
		};
		let lastInvoker;
		const filter = (invoke$1) => {
			const duration = toValue(ms);
			const maxDuration = toValue(options.maxWait);
			if (timer) _clearTimeout(timer);
			if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
				if (maxTimer) {
					_clearTimeout(maxTimer);
					maxTimer = void 0;
				}
				return Promise.resolve(invoke$1());
			}
			return new Promise((resolve, reject) => {
				lastRejector = options.rejectOnCancel ? reject : resolve;
				lastInvoker = invoke$1;
				if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
					if (timer) _clearTimeout(timer);
					maxTimer = void 0;
					resolve(lastInvoker());
				}, maxDuration);
				timer = setTimeout(() => {
					if (maxTimer) _clearTimeout(maxTimer);
					maxTimer = void 0;
					resolve(invoke$1());
				}, duration);
			});
		};
		return filter;
	}
	/**
	* EventFilter that gives extra controls to pause and resume the filter
	*
	* @param extendFilter  Extra filter to apply when the PausableFilter is active, default to none
	* @param options Options to configure the filter
	*/
	function pausableFilter(extendFilter = bypassFilter, options = {}) {
		const { initialState = "active" } = options;
		const isActive = toRef(initialState === "active");
		function pause() {
			isActive.value = false;
		}
		function resume() {
			isActive.value = true;
		}
		const eventFilter = (...args) => {
			if (isActive.value) extendFilter(...args);
		};
		return {
			isActive: /* @__PURE__ */ readonly(isActive),
			pause,
			resume,
			eventFilter
		};
	}
	function toArray(value) {
		return Array.isArray(value) ? value : [value];
	}
	function cacheStringFunction(fn) {
		const cache = Object.create(null);
		return ((str) => {
			return cache[str] || (cache[str] = fn(str));
		});
	}
	var hyphenateRE = /\B([A-Z])/g;
	cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
	var camelizeRE = /-(\w)/g;
	cacheStringFunction((str) => {
		return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
	});
	function getLifeCycleTarget(target) {
		return target || getCurrentInstance();
	}
	/**
	* Make a composable function usable with multiple Vue instances.
	*
	* @see https://vueuse.org/createSharedComposable
	*
	* @__NO_SIDE_EFFECTS__
	*/
	function createSharedComposable(composable) {
		if (!isClient) return composable;
		let subscribers = 0;
		let state;
		let scope;
		const dispose = () => {
			subscribers -= 1;
			if (scope && subscribers <= 0) {
				scope.stop();
				state = void 0;
				scope = void 0;
			}
		};
		return ((...args) => {
			subscribers += 1;
			if (!scope) {
				scope = effectScope(true);
				state = scope.run(() => composable(...args));
			}
			tryOnScopeDispose(dispose);
			return state;
		});
	}
	/**
	* Debounce execution of a function.
	*
	* @see https://vueuse.org/useDebounceFn
	* @param  fn          A function to be executed after delay milliseconds debounced.
	* @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
	* @param  options     Options
	*
	* @return A new, debounce, function.
	*
	* @__NO_SIDE_EFFECTS__
	*/
	function useDebounceFn(fn, ms = 200, options = {}) {
		return createFilterWrapper(debounceFilter(ms, options), fn);
	}
	function watchWithFilter(source, cb, options = {}) {
		const { eventFilter = bypassFilter, ...watchOptions } = options;
		return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
	}
	/** @deprecated Use Vue's built-in `watch` instead. This function will be removed in future version. */
	function watchPausable(source, cb, options = {}) {
		const { eventFilter: filter, initialState = "active", ...watchOptions } = options;
		const { eventFilter, pause, resume, isActive } = pausableFilter(filter, { initialState });
		return {
			stop: watchWithFilter(source, cb, {
				...watchOptions,
				eventFilter
			}),
			pause,
			resume,
			isActive
		};
	}
	/**
	* Call onBeforeUnmount() if it's inside a component lifecycle, if not, do nothing
	*
	* @param fn
	* @param target
	*/
	function tryOnBeforeUnmount(fn, target) {
		if (getLifeCycleTarget(target)) onBeforeUnmount(fn, target);
	}
	/**
	* Call onMounted() if it's inside a component lifecycle, if not, just call the function
	*
	* @param fn
	* @param sync if set to false, it will run in the nextTick() of Vue
	* @param target
	*/
	function tryOnMounted(fn, sync = true, target) {
		if (getLifeCycleTarget(target)) onMounted(fn, target);
		else if (sync) fn();
		else nextTick(fn);
	}
	/**
	* Wrapper for `setInterval` with controls
	*
	* @see https://vueuse.org/useIntervalFn
	* @param cb
	* @param interval
	* @param options
	*/
	function useIntervalFn(cb, interval = 1e3, options = {}) {
		const { immediate = true, immediateCallback = false } = options;
		let timer = null;
		const isActive = /* @__PURE__ */ shallowRef(false);
		function clean() {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		}
		function pause() {
			isActive.value = false;
			clean();
		}
		function resume() {
			const intervalValue = toValue(interval);
			if (intervalValue <= 0) return;
			isActive.value = true;
			if (immediateCallback) cb();
			clean();
			if (isActive.value) timer = setInterval(cb, intervalValue);
		}
		if (immediate && isClient) resume();
		if (/* @__PURE__ */ isRef(interval) || typeof interval === "function") tryOnScopeDispose(watch(interval, () => {
			if (isActive.value && isClient) resume();
		}));
		tryOnScopeDispose(pause);
		return {
			isActive: /* @__PURE__ */ shallowReadonly(isActive),
			pause,
			resume
		};
	}
	/**
	* Wrapper for `setTimeout` with controls.
	*
	* @param cb
	* @param interval
	* @param options
	*/
	function useTimeoutFn(cb, interval, options = {}) {
		const { immediate = true, immediateCallback = false } = options;
		const isPending = /* @__PURE__ */ shallowRef(false);
		let timer;
		function clear() {
			if (timer) {
				clearTimeout(timer);
				timer = void 0;
			}
		}
		function stop() {
			isPending.value = false;
			clear();
		}
		function start(...args) {
			if (immediateCallback) cb();
			clear();
			isPending.value = true;
			timer = setTimeout(() => {
				isPending.value = false;
				timer = void 0;
				cb(...args);
			}, toValue(interval));
		}
		if (immediate) {
			isPending.value = true;
			if (isClient) start();
		}
		tryOnScopeDispose(stop);
		return {
			isPending: /* @__PURE__ */ shallowReadonly(isPending),
			start,
			stop
		};
	}
	function useTimeout(interval = 1e3, options = {}) {
		const { controls: exposeControls = false, callback } = options;
		const controls = useTimeoutFn(callback !== null && callback !== void 0 ? callback : noop, interval, options);
		const ready = computed(() => !controls.isPending.value);
		if (exposeControls) return {
			ready,
			...controls
		};
		else return ready;
	}
	/**
	* Shorthand for watching value with {immediate: true}
	*
	* @see https://vueuse.org/watchImmediate
	*/
	function watchImmediate(source, cb, options) {
		return watch(source, cb, {
			...options,
			immediate: true
		});
	}
	//#endregion
	//#region node_modules/.pnpm/@vueuse+core@14.2.1_vue@3.5.32_typescript@6.0.2_/node_modules/@vueuse/core/dist/index.js
	var defaultWindow = isClient ? window : void 0;
	isClient && window.document;
	isClient && window.navigator;
	isClient && window.location;
	/**
	* Get the dom element of a ref of element or Vue component instance
	*
	* @param elRef
	*/
	function unrefElement(elRef) {
		var _$el;
		const plain = toValue(elRef);
		return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
	}
	function useEventListener(...args) {
		const register = (el, event, listener, options) => {
			el.addEventListener(event, listener, options);
			return () => el.removeEventListener(event, listener, options);
		};
		const firstParamTargets = computed(() => {
			const test = toArray(toValue(args[0])).filter((e) => e != null);
			return test.every((e) => typeof e !== "string") ? test : void 0;
		});
		return watchImmediate(() => {
			var _firstParamTargets$va, _firstParamTargets$va2;
			return [
				(_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
				toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
				toArray(unref(firstParamTargets.value ? args[2] : args[1])),
				toValue(firstParamTargets.value ? args[3] : args[2])
			];
		}, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
			if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
			const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
			const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
			onCleanup(() => {
				cleanups.forEach((fn) => fn());
			});
		}, { flush: "post" });
	}
	/**
	* Mounted state in ref.
	*
	* @see https://vueuse.org/useMounted
	*
	* @__NO_SIDE_EFFECTS__
	*/
	function useMounted() {
		const isMounted = /* @__PURE__ */ shallowRef(false);
		const instance = getCurrentInstance();
		if (instance) onMounted(() => {
			isMounted.value = true;
		}, instance);
		return isMounted;
	}
	/* @__NO_SIDE_EFFECTS__ */
	function useSupported(callback) {
		const isMounted = useMounted();
		return computed(() => {
			isMounted.value;
			return Boolean(callback());
		});
	}
	/**
	* Watch for changes being made to the DOM tree.
	*
	* @see https://vueuse.org/useMutationObserver
	* @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
	* @param target
	* @param callback
	* @param options
	*/
	function useMutationObserver(target, callback, options = {}) {
		const { window: window$1 = defaultWindow, ...mutationOptions } = options;
		let observer;
		const isSupported = /* @__PURE__ */ useSupported(() => window$1 && "MutationObserver" in window$1);
		const cleanup = () => {
			if (observer) {
				observer.disconnect();
				observer = void 0;
			}
		};
		const stopWatch = watch(computed(() => {
			const items = toArray(toValue(target)).map(unrefElement).filter(notNullish);
			return new Set(items);
		}), (newTargets) => {
			cleanup();
			if (isSupported.value && newTargets.size) {
				observer = new MutationObserver(callback);
				newTargets.forEach((el) => observer.observe(el, mutationOptions));
			}
		}, {
			immediate: true,
			flush: "post"
		});
		const takeRecords = () => {
			return observer === null || observer === void 0 ? void 0 : observer.takeRecords();
		};
		const stop = () => {
			stopWatch();
			cleanup();
		};
		tryOnScopeDispose(stop);
		return {
			isSupported,
			stop,
			takeRecords
		};
	}
	/**
	* Fires when the element or any element containing it is removed.
	*
	* @param target
	* @param callback
	* @param options
	*/
	function onElementRemoval(target, callback, options = {}) {
		const { window: window$1 = defaultWindow, document: document$1 = window$1 === null || window$1 === void 0 ? void 0 : window$1.document, flush = "sync" } = options;
		if (!window$1 || !document$1) return noop;
		let stopFn;
		const cleanupAndUpdate = (fn) => {
			stopFn === null || stopFn === void 0 || stopFn();
			stopFn = fn;
		};
		const stopWatch = watchEffect(() => {
			const el = unrefElement(target);
			if (el) {
				const { stop } = useMutationObserver(document$1, (mutationsList) => {
					if (mutationsList.map((mutation) => [...mutation.removedNodes]).flat().some((node) => node === el || node.contains(el))) callback(mutationsList);
				}, {
					window: window$1,
					childList: true,
					subtree: true
				});
				cleanupAndUpdate(stop);
			}
		}, { flush });
		const stopHandle = () => {
			stopWatch();
			cleanupAndUpdate();
		};
		tryOnScopeDispose(stopHandle);
		return stopHandle;
	}
	function createKeyPredicate(keyFilter) {
		if (typeof keyFilter === "function") return keyFilter;
		else if (typeof keyFilter === "string") return (event) => event.key === keyFilter;
		else if (Array.isArray(keyFilter)) return (event) => keyFilter.includes(event.key);
		return () => true;
	}
	function onKeyStroke(...args) {
		let key;
		let handler;
		let options = {};
		if (args.length === 3) {
			key = args[0];
			handler = args[1];
			options = args[2];
		} else if (args.length === 2) if (typeof args[1] === "object") {
			key = true;
			handler = args[0];
			options = args[1];
		} else {
			key = args[0];
			handler = args[1];
		}
		else {
			key = true;
			handler = args[0];
		}
		const { target = defaultWindow, eventName = "keydown", passive = false, dedupe = false } = options;
		const predicate = createKeyPredicate(key);
		const listener = (e) => {
			if (e.repeat && toValue(dedupe)) return;
			if (predicate(e)) handler(e);
		};
		return useEventListener(target, eventName, listener, passive);
	}
	/**
	* Reactive `document.activeElement`
	*
	* @see https://vueuse.org/useActiveElement
	* @param options
	*
	* @__NO_SIDE_EFFECTS__
	*/
	function useActiveElement(options = {}) {
		var _options$document;
		const { window: window$1 = defaultWindow, deep = true, triggerOnRemoval = false } = options;
		const document$1 = (_options$document = options.document) !== null && _options$document !== void 0 ? _options$document : window$1 === null || window$1 === void 0 ? void 0 : window$1.document;
		const getDeepActiveElement = () => {
			let element = document$1 === null || document$1 === void 0 ? void 0 : document$1.activeElement;
			if (deep) {
				var _element$shadowRoot;
				while (element === null || element === void 0 ? void 0 : element.shadowRoot) element = element === null || element === void 0 || (_element$shadowRoot = element.shadowRoot) === null || _element$shadowRoot === void 0 ? void 0 : _element$shadowRoot.activeElement;
			}
			return element;
		};
		const activeElement = /* @__PURE__ */ shallowRef();
		const trigger = () => {
			activeElement.value = getDeepActiveElement();
		};
		if (window$1) {
			const listenerOptions = {
				capture: true,
				passive: true
			};
			useEventListener(window$1, "blur", (event) => {
				if (event.relatedTarget !== null) return;
				trigger();
			}, listenerOptions);
			useEventListener(window$1, "focus", trigger, listenerOptions);
		}
		if (triggerOnRemoval) onElementRemoval(activeElement, trigger, { document: document$1 });
		trigger();
		return activeElement;
	}
	/**
	* Call function on every `requestAnimationFrame`. With controls of pausing and resuming.
	*
	* @see https://vueuse.org/useRafFn
	* @param fn
	* @param options
	*/
	function useRafFn(fn, options = {}) {
		const { immediate = true, fpsLimit = null, window: window$1 = defaultWindow, once = false } = options;
		const isActive = /* @__PURE__ */ shallowRef(false);
		const intervalLimit = computed(() => {
			const limit = toValue(fpsLimit);
			return limit ? 1e3 / limit : null;
		});
		let previousFrameTimestamp = 0;
		let rafId = null;
		function loop(timestamp$1) {
			if (!isActive.value || !window$1) return;
			if (!previousFrameTimestamp) previousFrameTimestamp = timestamp$1;
			const delta = timestamp$1 - previousFrameTimestamp;
			if (intervalLimit.value && delta < intervalLimit.value) {
				rafId = window$1.requestAnimationFrame(loop);
				return;
			}
			previousFrameTimestamp = timestamp$1;
			fn({
				delta,
				timestamp: timestamp$1
			});
			if (once) {
				isActive.value = false;
				rafId = null;
				return;
			}
			rafId = window$1.requestAnimationFrame(loop);
		}
		function resume() {
			if (!isActive.value && window$1) {
				isActive.value = true;
				previousFrameTimestamp = 0;
				rafId = window$1.requestAnimationFrame(loop);
			}
		}
		function pause() {
			isActive.value = false;
			if (rafId != null && window$1) {
				window$1.cancelAnimationFrame(rafId);
				rafId = null;
			}
		}
		if (immediate) resume();
		tryOnScopeDispose(pause);
		return {
			isActive: /* @__PURE__ */ readonly(isActive),
			pause,
			resume
		};
	}
	function cloneFnJSON(source) {
		return JSON.parse(JSON.stringify(source));
	}
	var _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
	var globalKey = "__vueuse_ssr_handlers__";
	var handlers = /* @__PURE__ */ getHandlers();
	function getHandlers() {
		if (!(globalKey in _global)) _global[globalKey] = _global[globalKey] || {};
		return _global[globalKey];
	}
	function getSSRHandler(key, fallback) {
		return handlers[key] || fallback;
	}
	function guessSerializerType(rawInit) {
		return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
	}
	var StorageSerializers = {
		boolean: {
			read: (v) => v === "true",
			write: (v) => String(v)
		},
		object: {
			read: (v) => JSON.parse(v),
			write: (v) => JSON.stringify(v)
		},
		number: {
			read: (v) => Number.parseFloat(v),
			write: (v) => String(v)
		},
		any: {
			read: (v) => v,
			write: (v) => String(v)
		},
		string: {
			read: (v) => v,
			write: (v) => String(v)
		},
		map: {
			read: (v) => new Map(JSON.parse(v)),
			write: (v) => JSON.stringify(Array.from(v.entries()))
		},
		set: {
			read: (v) => new Set(JSON.parse(v)),
			write: (v) => JSON.stringify(Array.from(v))
		},
		date: {
			read: (v) => new Date(v),
			write: (v) => v.toISOString()
		}
	};
	var customStorageEventName = "vueuse-storage";
	/**
	* Reactive LocalStorage/SessionStorage.
	*
	* @see https://vueuse.org/useStorage
	*/
	function useStorage(key, defaults$1, storage, options = {}) {
		var _options$serializer;
		const { flush = "pre", deep = true, listenToStorageChanges = true, writeDefaults = true, mergeDefaults = false, shallow, window: window$1 = defaultWindow, eventFilter, onError = (e) => {
			console.error(e);
		}, initOnMounted } = options;
		const data = (shallow ? shallowRef : ref)(typeof defaults$1 === "function" ? defaults$1() : defaults$1);
		const keyComputed = computed(() => toValue(key));
		if (!storage) try {
			storage = getSSRHandler("getDefaultStorage", () => defaultWindow === null || defaultWindow === void 0 ? void 0 : defaultWindow.localStorage)();
		} catch (e) {
			onError(e);
		}
		if (!storage) return data;
		const rawInit = toValue(defaults$1);
		const type = guessSerializerType(rawInit);
		const serializer = (_options$serializer = options.serializer) !== null && _options$serializer !== void 0 ? _options$serializer : StorageSerializers[type];
		const { pause: pauseWatch, resume: resumeWatch } = watchPausable(data, (newValue) => write(newValue), {
			flush,
			deep,
			eventFilter
		});
		watch(keyComputed, () => update(), { flush });
		let firstMounted = false;
		const onStorageEvent = (ev) => {
			if (initOnMounted && !firstMounted) return;
			update(ev);
		};
		const onStorageCustomEvent = (ev) => {
			if (initOnMounted && !firstMounted) return;
			updateFromCustomEvent(ev);
		};
		/**
		* The custom event is needed for same-document syncing when using custom
		* storage backends, but it doesn't work across different documents.
		*
		* TODO: Consider implementing a BroadcastChannel-based solution that fixes this.
		*/
		if (window$1 && listenToStorageChanges) if (storage instanceof Storage) useEventListener(window$1, "storage", onStorageEvent, { passive: true });
		else useEventListener(window$1, customStorageEventName, onStorageCustomEvent);
		if (initOnMounted) tryOnMounted(() => {
			firstMounted = true;
			update();
		});
		else update();
		function dispatchWriteEvent(oldValue, newValue) {
			if (window$1) {
				const payload = {
					key: keyComputed.value,
					oldValue,
					newValue,
					storageArea: storage
				};
				window$1.dispatchEvent(storage instanceof Storage ? new StorageEvent("storage", payload) : new CustomEvent(customStorageEventName, { detail: payload }));
			}
		}
		function write(v) {
			try {
				const oldValue = storage.getItem(keyComputed.value);
				if (v == null) {
					dispatchWriteEvent(oldValue, null);
					storage.removeItem(keyComputed.value);
				} else {
					const serialized = serializer.write(v);
					if (oldValue !== serialized) {
						storage.setItem(keyComputed.value, serialized);
						dispatchWriteEvent(oldValue, serialized);
					}
				}
			} catch (e) {
				onError(e);
			}
		}
		function read(event) {
			const rawValue = event ? event.newValue : storage.getItem(keyComputed.value);
			if (rawValue == null) {
				if (writeDefaults && rawInit != null) storage.setItem(keyComputed.value, serializer.write(rawInit));
				return rawInit;
			} else if (!event && mergeDefaults) {
				const value = serializer.read(rawValue);
				if (typeof mergeDefaults === "function") return mergeDefaults(value, rawInit);
				else if (type === "object" && !Array.isArray(value)) return {
					...rawInit,
					...value
				};
				return value;
			} else if (typeof rawValue !== "string") return rawValue;
			else return serializer.read(rawValue);
		}
		function update(event) {
			if (event && event.storageArea !== storage) return;
			if (event && event.key == null) {
				data.value = rawInit;
				return;
			}
			if (event && event.key !== keyComputed.value) return;
			pauseWatch();
			try {
				const serializedData = serializer.write(data.value);
				if (event === void 0 || (event === null || event === void 0 ? void 0 : event.newValue) !== serializedData) data.value = read(event);
			} catch (e) {
				onError(e);
			} finally {
				if (event) nextTick(resumeWatch);
				else resumeWatch();
			}
		}
		function updateFromCustomEvent(event) {
			update(event.detail);
		}
		return data;
	}
	var EVENT_FOCUS_IN = "focusin";
	var EVENT_FOCUS_OUT = "focusout";
	var PSEUDO_CLASS_FOCUS_WITHIN = ":focus-within";
	/**
	* Track if focus is contained within the target element
	*
	* @see https://vueuse.org/useFocusWithin
	* @param target The target element to track
	* @param options Focus within options
	*/
	function useFocusWithin(target, options = {}) {
		const { window: window$1 = defaultWindow } = options;
		const targetElement = computed(() => unrefElement(target));
		const _focused = /* @__PURE__ */ shallowRef(false);
		const focused = computed(() => _focused.value);
		const activeElement = useActiveElement(options);
		if (!window$1 || !activeElement.value) return { focused };
		const listenerOptions = { passive: true };
		useEventListener(targetElement, EVENT_FOCUS_IN, () => _focused.value = true, listenerOptions);
		useEventListener(targetElement, EVENT_FOCUS_OUT, () => {
			var _targetElement$value$, _targetElement$value, _targetElement$value$2;
			return _focused.value = (_targetElement$value$ = (_targetElement$value = targetElement.value) === null || _targetElement$value === void 0 || (_targetElement$value$2 = _targetElement$value.matches) === null || _targetElement$value$2 === void 0 ? void 0 : _targetElement$value$2.call(_targetElement$value, PSEUDO_CLASS_FOCUS_WITHIN)) !== null && _targetElement$value$ !== void 0 ? _targetElement$value$ : false;
		}, listenerOptions);
		return { focused };
	}
	var DefaultMagicKeysAliasMap = {
		ctrl: "control",
		command: "meta",
		cmd: "meta",
		option: "alt",
		up: "arrowup",
		down: "arrowdown",
		left: "arrowleft",
		right: "arrowright"
	};
	/**
	* Reactive keys pressed state, with magical keys combination support.
	*
	* @see https://vueuse.org/useMagicKeys
	*/
	function useMagicKeys(options = {}) {
		const { reactive: useReactive = false, target = defaultWindow, aliasMap = DefaultMagicKeysAliasMap, passive = true, onEventFired = noop } = options;
		const current = /* @__PURE__ */ reactive(/* @__PURE__ */ new Set());
		const obj = {
			toJSON() {
				return {};
			},
			current
		};
		const refs = useReactive ? /* @__PURE__ */ reactive(obj) : obj;
		const metaDeps = /* @__PURE__ */ new Set();
		const depsMap = new Map([
			["Meta", metaDeps],
			["Shift", /* @__PURE__ */ new Set()],
			["Alt", /* @__PURE__ */ new Set()]
		]);
		const usedKeys = /* @__PURE__ */ new Set();
		function setRefs(key, value) {
			if (key in refs) if (useReactive) refs[key] = value;
			else refs[key].value = value;
		}
		function reset() {
			current.clear();
			for (const key of usedKeys) setRefs(key, false);
		}
		function updateDeps(value, e, keys$1) {
			if (!value || typeof e.getModifierState !== "function") return;
			for (const [modifier, depsSet] of depsMap) if (e.getModifierState(modifier)) {
				keys$1.forEach((key) => depsSet.add(key));
				break;
			}
		}
		function clearDeps(value, key) {
			if (value) return;
			const depsMapKey = `${key[0].toUpperCase()}${key.slice(1)}`;
			const deps = depsMap.get(depsMapKey);
			if (!["shift", "alt"].includes(key) || !deps) return;
			const depsArray = Array.from(deps);
			const depsIndex = depsArray.indexOf(key);
			depsArray.forEach((key$1, index) => {
				if (index >= depsIndex) {
					current.delete(key$1);
					setRefs(key$1, false);
				}
			});
			deps.clear();
		}
		function updateRefs(e, value) {
			var _e$key, _e$code;
			const key = (_e$key = e.key) === null || _e$key === void 0 ? void 0 : _e$key.toLowerCase();
			const values = [(_e$code = e.code) === null || _e$code === void 0 ? void 0 : _e$code.toLowerCase(), key].filter(Boolean);
			if (!key) return;
			if (key) if (value) current.add(key);
			else current.delete(key);
			for (const key$1 of values) {
				usedKeys.add(key$1);
				setRefs(key$1, value);
			}
			updateDeps(value, e, [...current, ...values]);
			clearDeps(value, key);
			if (key === "meta" && !value) {
				metaDeps.forEach((key$1) => {
					current.delete(key$1);
					setRefs(key$1, false);
				});
				metaDeps.clear();
			}
		}
		useEventListener(target, "keydown", (e) => {
			updateRefs(e, true);
			return onEventFired(e);
		}, { passive });
		useEventListener(target, "keyup", (e) => {
			updateRefs(e, false);
			return onEventFired(e);
		}, { passive });
		useEventListener("blur", reset, { passive });
		useEventListener("focus", reset, { passive });
		const proxy = new Proxy(refs, { get(target$1, prop, rec) {
			if (typeof prop !== "string") return Reflect.get(target$1, prop, rec);
			prop = prop.toLowerCase();
			if (prop in aliasMap) prop = aliasMap[prop];
			if (!(prop in refs)) if (/[+_-]/.test(prop)) {
				const keys$1 = prop.split(/[+_-]/g).map((i) => i.trim());
				refs[prop] = computed(() => keys$1.map((key) => toValue(proxy[key])).every(Boolean));
			} else refs[prop] = /* @__PURE__ */ shallowRef(false);
			const r = Reflect.get(target$1, prop, rec);
			return useReactive ? toValue(r) : r;
		} });
		return proxy;
	}
	Number.POSITIVE_INFINITY;
	/**
	* Shorthand for v-model binding, props + emit -> ref
	*
	* @see https://vueuse.org/useVModel
	* @param props
	* @param key (default 'modelValue')
	* @param emit
	* @param options
	*
	* @__NO_SIDE_EFFECTS__
	*/
	function useVModel(props, key, emit, options = {}) {
		var _vm$$emit, _vm$proxy;
		const { clone = false, passive = false, eventName, deep = false, defaultValue, shouldEmit } = options;
		const vm = getCurrentInstance();
		const _emit = emit || (vm === null || vm === void 0 ? void 0 : vm.emit) || (vm === null || vm === void 0 || (_vm$$emit = vm.$emit) === null || _vm$$emit === void 0 ? void 0 : _vm$$emit.bind(vm)) || (vm === null || vm === void 0 || (_vm$proxy = vm.proxy) === null || _vm$proxy === void 0 || (_vm$proxy = _vm$proxy.$emit) === null || _vm$proxy === void 0 ? void 0 : _vm$proxy.bind(vm === null || vm === void 0 ? void 0 : vm.proxy));
		let event = eventName;
		if (!key) key = "modelValue";
		event = event || `update:${key.toString()}`;
		const cloneFn = (val) => !clone ? val : typeof clone === "function" ? clone(val) : cloneFnJSON(val);
		const getValue$1 = () => isDef(props[key]) ? cloneFn(props[key]) : defaultValue;
		const triggerEmit = (value) => {
			if (shouldEmit) {
				if (shouldEmit(value)) _emit(event, value);
			} else _emit(event, value);
		};
		if (passive) {
			const proxy = /* @__PURE__ */ ref(getValue$1());
			let isUpdating = false;
			watch(() => props[key], (v) => {
				if (!isUpdating) {
					isUpdating = true;
					proxy.value = cloneFn(v);
					nextTick(() => isUpdating = false);
				}
			});
			watch(proxy, (v) => {
				if (!isUpdating && (v !== props[key] || deep)) triggerEmit(v);
			}, { deep });
			return proxy;
		} else return computed({
			get() {
				return getValue$1();
			},
			set(value) {
				triggerEmit(value);
			}
		});
	}
	//#endregion
	//#region src/composables/useGlobalState.ts
	var useGlobalState = createGlobalState(() => {
		return {
			csrfToken: /* @__PURE__ */ ref(null),
			cpTrigger: /* @__PURE__ */ ref(null),
			sites: /* @__PURE__ */ ref([]),
			primarySiteId: /* @__PURE__ */ ref(1),
			hasSelectedVolumes: /* @__PURE__ */ ref(true)
		};
	});
	//#endregion
	//#region src/utils/apiClient.ts
	var ApiError = class extends Error {
		status;
		payload;
		constructor(message, status, payload = null) {
			super(message);
			this.name = "ApiError";
			this.status = status;
			this.payload = payload;
		}
	};
	var isPlainObject$1 = (value) => Object.prototype.toString.call(value) === "[object Object]";
	var isErrorEnvelope = (payload) => isPlainObject$1(payload) && payload.status === "error" && typeof payload.message === "string";
	var isSuccessEnvelope = (payload) => isPlainObject$1(payload) && payload.status === "success" && "data" in payload;
	var getCsrfToken = () => {
		try {
			const { csrfToken } = useGlobalState();
			return csrfToken.value;
		} catch {
			return null;
		}
	};
	var appendCsrf = (body, includeCsrf) => {
		const token = includeCsrf ? getCsrfToken() : null;
		if (!includeCsrf || !token) return body;
		if (body instanceof FormData) {
			body.append(token.name, token.value);
			return body;
		}
		if (isPlainObject$1(body)) return {
			...body,
			[token.name]: token.value
		};
		return body;
	};
	async function request(url, options = {}) {
		const headers = new Headers({ Accept: "application/json" });
		if (options.headers) new Headers(options.headers).forEach((value, key) => {
			headers.set(key, value);
		});
		const shouldIncludeCsrf = options.includeCsrf ?? true;
		let body = appendCsrf(options.body, shouldIncludeCsrf);
		if (isPlainObject$1(body)) {
			if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
			body = JSON.stringify(body);
		}
		const response = await fetch(url, {
			method: options.method ?? "GET",
			headers,
			body,
			signal: options.signal
		});
		const payload = (response.headers.get("Content-Type") ?? "").includes("application/json") ? await response.json() : await response.text();
		if (!response.ok) throw new ApiError((isPlainObject$1(payload) && typeof payload.message === "string" ? payload.message : response.statusText) || "Request failed", response.status, payload);
		if (isErrorEnvelope(payload)) throw new ApiError(payload.message, response.status, payload);
		if (isSuccessEnvelope(payload)) return {
			data: payload.data,
			message: payload.message ?? null
		};
		return {
			data: payload,
			message: null
		};
	}
	var apiClient = {
		get(url, options = {}) {
			return request(url, {
				...options,
				method: "GET"
			});
		},
		postJson(url, body, options = {}) {
			return request(url, {
				...options,
				method: "POST",
				body,
				headers: {
					"Content-Type": "application/json",
					...options.headers
				}
			});
		},
		postForm(url, form, options = {}) {
			return request(url, {
				...options,
				method: "POST",
				body: form
			});
		}
	};
	//#endregion
	//#region src/composables/useAssets.ts
	var useAssetsState = createGlobalState(() => {
		const assets = /* @__PURE__ */ ref({});
		const assetIds = /* @__PURE__ */ ref([]);
		const loading = /* @__PURE__ */ ref(false);
		const error = /* @__PURE__ */ ref(null);
		const pagination = /* @__PURE__ */ ref(null);
		const defaultLimit = /* @__PURE__ */ ref(20);
		const defaultOffset = /* @__PURE__ */ ref(0);
		const defaultSort = /* @__PURE__ */ ref("dateCreated");
		const defaultQuery = /* @__PURE__ */ ref("");
		const defaultFilter = /* @__PURE__ */ ref("all");
		const setDefaults = (limit, offset, sort, query, filter) => {
			if (typeof limit === "number") defaultLimit.value = limit;
			if (typeof offset === "number") defaultOffset.value = offset;
			if (typeof sort === "string") defaultSort.value = sort;
			if (typeof query === "string") defaultQuery.value = query;
			if (typeof filter === "string") defaultFilter.value = filter;
		};
		const fetchAssets = async (options = {}) => {
			const limit = options.limit ?? defaultLimit.value;
			const offset = options.offset ?? defaultOffset.value;
			const sort = options.sort ?? defaultSort.value;
			const query = options.query ?? defaultQuery.value;
			const filter = options.filter ?? defaultFilter.value;
			loading.value = true;
			error.value = null;
			try {
				const { data } = await apiClient.get(`/actions/altpilot/web/get-all-assets?limit=${limit}&offset=${offset}&sort=${sort}&filter=${filter}&query=${encodeURIComponent(query)}&siteId=all`);
				assets.value = data.assets ?? {};
				assetIds.value = data.assetIds ?? [];
				pagination.value = data.pagination ?? null;
			} catch (err) {
				error.value = err instanceof Error ? err.message : "Unknown error";
				assets.value = {};
				assetIds.value = [];
				pagination.value = null;
			} finally {
				loading.value = false;
			}
		};
		const replaceAsset = (updatedAsset) => {
			const assetId = updatedAsset.id;
			const siteId = updatedAsset.siteId;
			if (siteId == null) return;
			if (!assets.value[assetId]) return;
			assets.value[assetId][siteId] = updatedAsset;
		};
		return {
			assets,
			assetIds,
			loading,
			error,
			pagination,
			sort: defaultSort,
			query: defaultQuery,
			filter: defaultFilter,
			fetchAssets,
			setDefaults,
			replaceAsset
		};
	});
	function useAssets(options) {
		const state = useAssetsState();
		if (options) state.setDefaults(options.defaultLimit, options.defaultOffset, options.defaultSort, options.defaultQuery, options.defaultFilter);
		return state;
	}
	//#endregion
	//#region src/composables/useStatusCounts.ts
	var STATUS_LABELS = {
		0: "Missing alt text",
		1: "AI-generated",
		2: "Manual"
	};
	var DEFAULT_STATUS_ORDER = [
		0,
		1,
		2
	];
	var useStatusCountsState = createGlobalState(() => {
		const statusCounts = /* @__PURE__ */ ref(DEFAULT_STATUS_ORDER.reduce((acc, code) => {
			acc[code] = 0;
			return acc;
		}, {}));
		const total = /* @__PURE__ */ ref(0);
		const loading = /* @__PURE__ */ ref(false);
		const error = /* @__PURE__ */ ref(null);
		const fetchStatusCounts = async () => {
			loading.value = true;
			error.value = null;
			try {
				const { data } = await apiClient.get("/actions/altpilot/web/get-status-counts");
				const countsPayloadEntries = Object.entries(data.counts ?? {}).reduce((acc, [status, count]) => {
					acc[status] = Number(count);
					return acc;
				}, {});
				statusCounts.value = DEFAULT_STATUS_ORDER.reduce((acc, code) => {
					acc[code] = countsPayloadEntries[String(code)] ?? 0;
					return acc;
				}, {});
				total.value = typeof data.total === "number" ? data.total : DEFAULT_STATUS_ORDER.reduce((sum, code) => sum + (statusCounts.value[code] ?? 0), 0);
			} catch (err) {
				error.value = err instanceof Error ? err.message : "Unknown error";
				statusCounts.value = DEFAULT_STATUS_ORDER.reduce((acc, code) => {
					acc[code] = 0;
					return acc;
				}, {});
				total.value = 0;
			} finally {
				loading.value = false;
			}
		};
		const refetchStatusCounts = () => fetchStatusCounts();
		const statusCountItems = computed(() => DEFAULT_STATUS_ORDER.map((code) => ({
			code,
			label: STATUS_LABELS[code] ?? `Status ${code}`,
			count: statusCounts.value[code] ?? 0
		})));
		return {
			statusCounts,
			missingCount: computed(() => statusCounts.value[0] ?? 0),
			aiGeneratedCount: computed(() => statusCounts.value[1] ?? 0),
			manualCount: computed(() => statusCounts.value[2] ?? 0),
			total,
			loading,
			error,
			fetchStatusCounts,
			refetchStatusCounts,
			statusCountItems
		};
	});
	var useStatusCounts = () => useStatusCountsState();
	//#endregion
	//#region src/composables/useToasts.ts
	var createId = () => {
		try {
			return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
		} catch {
			return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
		}
	};
	var useToasts = createGlobalState(() => {
		const toasts = /* @__PURE__ */ ref([]);
		const maxToasts = /* @__PURE__ */ ref(5);
		function toast(input) {
			const item = {
				id: createId(),
				open: true,
				createdAt: Date.now(),
				type: input.type ?? "foreground",
				title: input.title,
				description: input.description,
				duration: input.duration,
				action: input.action
			};
			toasts.value = [...toasts.value, item].slice(-maxToasts.value);
			return item.id;
		}
		function dismiss(id) {
			const item = toasts.value.find((t) => t.id === id);
			if (item) item.open = false;
		}
		function remove(id) {
			toasts.value = toasts.value.filter((t) => t.id !== id);
		}
		function onOpenChange(id, open) {
			if (open) return;
			window.setTimeout(() => remove(id), 150);
		}
		return {
			toasts,
			maxToasts,
			toast,
			dismiss,
			remove,
			onOpenChange
		};
	});
	//#endregion
	//#region src/composables/useAssetAltEditor.ts
	var { primarySiteId } = useGlobalState();
	function buildInitialAltMap(asset) {
		const map = {};
		Object.values(asset).forEach((localized) => {
			map[localized.siteId] = localized.alt ?? "";
		});
		return map;
	}
	function useAssetAltEditor(asset) {
		const altTexts = /* @__PURE__ */ reactive(buildInitialAltMap(asset));
		const originalAltTexts = /* @__PURE__ */ reactive(buildInitialAltMap(asset));
		const saving = /* @__PURE__ */ ref(false);
		const error = /* @__PURE__ */ ref(null);
		const successMessage = /* @__PURE__ */ ref(null);
		const { toast } = useToasts();
		const isSiteChanged = (siteId) => {
			return (altTexts[siteId] ?? "").trim() !== (originalAltTexts[siteId] ?? "").trim();
		};
		watch(() => {
			const currentAlts = {};
			Object.values(asset).forEach((localized) => {
				currentAlts[localized.siteId] = localized.alt ?? "";
			});
			return currentAlts;
		}, (newAlts, oldAlts) => {
			Object.entries(newAlts).forEach(([siteIdStr, newAlt]) => {
				const siteId = Number(siteIdStr);
				if (newAlt !== (oldAlts?.[siteId] ?? "")) {
					altTexts[siteId] = newAlt;
					originalAltTexts[siteId] = newAlt;
				}
			});
		}, { deep: true });
		const hasChanges = computed(() => {
			const keys = new Set([...Object.keys(originalAltTexts), ...Object.keys(altTexts)]);
			for (const key of keys) if (isSiteChanged(Number(key))) return true;
			return false;
		});
		const hasSiteChanges = (siteId) => {
			return isSiteChanged(siteId);
		};
		const resetChanges = () => {
			const keys = new Set([...Object.keys(originalAltTexts), ...Object.keys(altTexts)]);
			for (const key of keys) {
				const siteId = Number(key);
				altTexts[siteId] = originalAltTexts[siteId] ?? "";
			}
			error.value = null;
			successMessage.value = null;
		};
		const getChangedAltTexts = () => {
			const changed = {};
			new Set([...Object.keys(originalAltTexts), ...Object.keys(altTexts)]).forEach((key) => {
				const siteId = Number(key);
				if (isSiteChanged(siteId)) changed[siteId] = (altTexts[siteId] ?? "").trim();
			});
			return changed;
		};
		const save = async () => {
			if (!hasChanges.value || saving.value) return;
			saving.value = true;
			error.value = null;
			successMessage.value = null;
			const assetId = asset[primarySiteId.value]?.id;
			if (!assetId) {
				error.value = "Asset ID missing";
				toast({
					title: "Error",
					description: error.value,
					type: "foreground"
				});
				saving.value = false;
				return;
			}
			try {
				const changedAltTexts = getChangedAltTexts();
				if (Object.keys(changedAltTexts).length === 0) {
					saving.value = false;
					return;
				}
				const payload = {
					assetID: assetId,
					altTexts: changedAltTexts
				};
				const { data } = await apiClient.postJson("/actions/altpilot/web/save-alt-texts", payload);
				if (!data) throw new Error("Failed to save alt texts");
				Object.entries(altTexts).forEach(([siteIdString, value]) => {
					const siteId = Number(siteIdString);
					if (originalAltTexts[siteId] !== value) {
						originalAltTexts[siteId] = value;
						if (asset[siteId]) {
							const newStatus = value.trim() === "" ? 0 : 2;
							asset[siteId].status = newStatus;
							asset[siteId].alt = value;
						}
					}
				});
				successMessage.value = "Alt texts saved";
				toast({
					title: "Saved",
					description: successMessage.value,
					type: "foreground"
				});
			} catch (err) {
				error.value = err instanceof Error ? err.message : "Unknown error";
				toast({
					title: "Error",
					description: error.value,
					type: "foreground"
				});
			} finally {
				saving.value = false;
			}
		};
		return {
			altTexts,
			hasChanges,
			hasSiteChanges,
			resetChanges,
			saving,
			error,
			successMessage,
			save
		};
	}
	//#endregion
	//#region src/composables/useGenerationTracker.ts
	var ASSET_KEY_SEPARATOR = ":";
	var makeKey = (assetId, siteId) => `${assetId}${ASSET_KEY_SEPARATOR}${siteId ?? "default"}`;
	var ACTIVE_STATUSES = ["waiting", "running"];
	var queuePollInterval = 1e3;
	/**
	* Get a user-friendly error message for a failed job
	*/
	var getErrorMessageForFailedJob = (item) => {
		if (item.error?.message) return item.error.message;
		return item.message ?? "Generation failed";
	};
	var useGenerationTracker = createGlobalState(() => {
		const trackedAssets = /* @__PURE__ */ reactive(/* @__PURE__ */ new Map());
		const lastError = /* @__PURE__ */ ref(null);
		const { csrfToken } = useGlobalState();
		const { replaceAsset } = useAssets();
		const { fetchStatusCounts } = useStatusCounts();
		const { toast } = useToasts();
		const pollQueue = async () => {
			if (!csrfToken.value) return;
			const activeEntries = Array.from(trackedAssets.values()).filter((entry) => ACTIVE_STATUSES.includes(entry.status));
			if (activeEntries.length === 0) return;
			const payload = {
				assets: activeEntries.map((entry) => ({
					assetId: entry.assetId,
					siteId: entry.siteId,
					jobId: entry.jobId
				})),
				[csrfToken.value.name]: csrfToken.value.value
			};
			try {
				const { data } = await apiClient.postJson("/actions/altpilot/web/job-status", payload);
				(data?.assets ?? []).forEach((item) => {
					const key = makeKey(item.assetId, item.siteId ?? null);
					const existing = trackedAssets.get(key);
					if (item.status === "finished" && item.asset) {
						replaceAsset(item.asset);
						const message = item.message ?? "Alt text updated";
						toast({
							title: "Generated",
							description: message,
							type: "foreground"
						});
						fetchStatusCounts();
						if (existing) {
							existing.status = "finished";
							existing.message = message;
						} else trackedAssets.set(key, {
							assetId: item.assetId,
							siteId: item.siteId ?? null,
							jobId: item.jobId ?? null,
							status: "finished",
							message
						});
						setTimeout(() => {
							trackedAssets.delete(key);
						}, 2e3);
						return;
					}
					if (item.status === "missing") {
						const message = item.message ?? "Asset not found";
						toast({
							title: "Error",
							description: message,
							type: "foreground"
						});
						if (existing) {
							existing.status = "missing";
							existing.message = message;
						} else trackedAssets.set(key, {
							assetId: item.assetId,
							siteId: item.siteId ?? null,
							jobId: item.jobId ?? null,
							status: "missing",
							message
						});
						setTimeout(() => {
							trackedAssets.delete(key);
						}, 2500);
						return;
					}
					if (item.status === "failed") toast({
						title: "Error",
						description: getErrorMessageForFailedJob(item),
						type: "foreground"
					});
					if (!existing) {
						trackedAssets.set(key, {
							assetId: item.assetId,
							siteId: item.siteId ?? null,
							jobId: item.jobId ?? null,
							status: item.status ?? "unknown",
							message: item.message ?? null
						});
						return;
					}
					existing.status = item.status ?? existing.status;
					existing.message = item.message ?? existing.message;
					existing.jobId = item.jobId ?? existing.jobId;
					if (!ACTIVE_STATUSES.includes(existing.status)) setTimeout(() => {
						trackedAssets.delete(key);
					}, 2e3);
				});
				lastError.value = null;
			} catch (err) {
				lastError.value = err instanceof Error ? err.message : "Unknown error";
			}
		};
		const { pause, resume } = useIntervalFn(pollQueue, queuePollInterval, { immediate: false });
		watch(() => trackedAssets.size, (size) => {
			if (size > 0) resume();
			else pause();
		}, { immediate: true });
		const trackAsset = (options) => {
			const key = makeKey(options.assetId, options.siteId ?? null);
			trackedAssets.set(key, {
				assetId: options.assetId,
				siteId: options.siteId ?? null,
				jobId: options.jobId ?? null,
				status: "waiting",
				message: options.message ?? null
			});
		};
		const clearAsset = (assetId, siteId) => {
			trackedAssets.delete(makeKey(assetId, siteId ?? null));
		};
		const stateForAsset = (assetId, siteId) => trackedAssets.get(makeKey(assetId, siteId ?? null)) ?? null;
		const isAssetRunning = (assetId, siteId) => {
			const state = stateForAsset(assetId, siteId);
			if (!state) return false;
			return ACTIVE_STATUSES.includes(state.status);
		};
		return {
			trackAsset,
			clearAsset,
			stateForAsset,
			isAssetRunning,
			lastError
		};
	});
	//#endregion
	//#region src/composables/useAssetGeneration.ts
	var HIDDEN_IFRAME_REMOVE_DELAY = 1e3;
	function useAssetGeneration(asset) {
		const { csrfToken, cpTrigger } = useGlobalState();
		const { trackAsset, stateForAsset, isAssetRunning } = useGenerationTracker();
		const { toast } = useToasts();
		const generatingBySite = /* @__PURE__ */ reactive({});
		const errorBySite = /* @__PURE__ */ reactive({});
		const successBySite = /* @__PURE__ */ reactive({});
		const triggerQueueRunner = () => {
			if (!cpTrigger.value) return;
			const iframe = document.createElement("iframe");
			iframe.style.display = "none";
			iframe.style.width = "0";
			iframe.style.height = "0";
			iframe.src = `/${cpTrigger.value}`;
			document.body.appendChild(iframe);
			setTimeout(() => {
				if (iframe.parentNode) document.body.removeChild(iframe);
			}, HIDDEN_IFRAME_REMOVE_DELAY);
		};
		const generateForSite = async (siteId) => {
			if (!csrfToken.value) {
				const msg = "CSRF token not available";
				errorBySite[siteId] = msg;
				toast({
					title: "Error",
					description: msg,
					type: "foreground"
				});
				return;
			}
			if (generatingBySite[siteId]) return;
			generatingBySite[siteId] = true;
			errorBySite[siteId] = null;
			successBySite[siteId] = null;
			try {
				const payload = {
					assetID: asset[siteId].id.toString(),
					siteId: siteId.toString()
				};
				const { data, message } = await apiClient.postJson("/actions/altpilot/web/queue", payload);
				const msg = message || "Alt text generation queued successfully";
				successBySite[siteId] = msg;
				toast({
					title: "Queued",
					description: msg,
					type: "foreground"
				});
				trackAsset({
					assetId: asset[siteId].id,
					siteId,
					jobId: data.jobId ?? null,
					message
				});
				triggerQueueRunner();
			} catch (err) {
				const msg = err instanceof Error ? err.message : "Unknown error";
				errorBySite[siteId] = msg;
				toast({
					title: "Error",
					description: msg,
					type: "foreground"
				});
			} finally {
				generatingBySite[siteId] = false;
			}
		};
		const isGenerationActive = (siteId) => isAssetRunning(asset[siteId].id, siteId) || !!generatingBySite[siteId];
		const isGenerationFinished = (siteId) => stateForAsset(asset[siteId].id, siteId)?.status === "finished";
		const generationMessage = (siteId) => stateForAsset(asset[siteId].id, siteId)?.message ?? null;
		return {
			generateForSite,
			generatingBySite,
			errorBySite,
			successBySite,
			isGenerationActive,
			isGenerationFinished,
			generationMessage
		};
	}
	//#endregion
	//#region src/utils/assetStatus.ts
	var assetStatus = {
		0: "missing",
		1: "AI-generated",
		2: "manually"
	};
	var assetStatusShort = {
		0: "?!",
		1: "AI",
		2: "ME"
	};
	//#endregion
	//#region src/components/OverwriteConfirmationDialog.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$12 = {
		key: 0,
		class: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
	};
	var _hoisted_2$10 = { class: "w-full max-w-md rounded-lg bg-white p-6 text-ap-dark-green shadow-xl" };
	var _hoisted_3$9 = { class: "mb-4" };
	var _hoisted_4$8 = { class: "mb-6 flex items-center gap-2" };
	//#endregion
	//#region src/components/OverwriteConfirmationDialog.vue
	var OverwriteConfirmationDialog_default = /* @__PURE__ */ defineComponent({
		__name: "OverwriteConfirmationDialog",
		props: {
			open: { type: Boolean },
			siteName: {}
		},
		emits: [
			"confirm",
			"cancel",
			"update:open"
		],
		setup(__props, { emit: __emit }) {
			const emit = __emit;
			const doNotShowAgain = useStorage("altpilot-suppress-overwrite-warning", false);
			const handleConfirm = () => {
				emit("confirm");
				emit("update:open", false);
			};
			const handleCancel = () => {
				emit("cancel");
				emit("update:open", false);
			};
			return (_ctx, _cache) => {
				return __props.open ? (openBlock(), createElementBlock("div", _hoisted_1$12, [createBaseVNode("div", _hoisted_2$10, [
					_cache[4] || (_cache[4] = createBaseVNode("h3", { class: "mb-2 text-lg font-bold" }, "Overwrite Alt Text?", -1)),
					createBaseVNode("p", _hoisted_3$9, [
						_cache[1] || (_cache[1] = createTextVNode(" This will overwrite the existing alt text for ", -1)),
						createBaseVNode("strong", null, toDisplayString(__props.siteName), 1),
						_cache[2] || (_cache[2] = createTextVNode(". This action cannot be undone. ", -1))
					]),
					createBaseVNode("div", _hoisted_4$8, [withDirectives(createBaseVNode("input", {
						id: "suppress-warning",
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => /* @__PURE__ */ isRef(doNotShowAgain) ? doNotShowAgain.value = $event : null),
						type: "checkbox",
						class: "h-4 w-4 rounded border-ap-dark-green text-ap-dark-green focus:ring-ap-dark-green"
					}, null, 512), [[vModelCheckbox, unref(doNotShowAgain)]]), _cache[3] || (_cache[3] = createBaseVNode("label", {
						for: "suppress-warning",
						class: "text-sm select-none"
					}, " Don't show this again ", -1))]),
					createBaseVNode("div", { class: "flex justify-end gap-3" }, [createBaseVNode("button", {
						class: "rounded-full border border-ap-dark-green bg-white px-3 text-xl text-ap-dark-green transition-colors hover:bg-ap-light-green/30",
						onClick: handleCancel
					}, " Cancel "), createBaseVNode("button", {
						class: "rounded-full border border-ap-dark-green bg-ap-dark-green px-3 text-xl text-ap-light-green transition-colors hover:bg-ap-light-green hover:text-ap-dark-green",
						onClick: handleConfirm
					}, " Generate ")])
				])])) : createCommentVNode("", true);
			};
		}
	});
	//#endregion
	//#region src/components/AssetCard.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$11 = { class: "relative h-32 w-full" };
	var _hoisted_2$9 = ["src", "alt"];
	var _hoisted_3$8 = {
		key: 0,
		class: "absolute bottom-2 left-2"
	};
	var _hoisted_4$7 = ["href"];
	var _hoisted_5$4 = ["disabled"];
	var _hoisted_6$4 = ["disabled"];
	var _hoisted_7$2 = { class: "flex w-full gap-0 pt-2" };
	var _hoisted_8$2 = { class: "relative flex w-full items-center px-3" };
	var _hoisted_9$1 = { class: "text-ap-dark-green uppercase" };
	var _hoisted_10$1 = ["disabled", "onClick"];
	var _hoisted_11 = { class: "w-full px-3 py-1" };
	var _hoisted_12 = [
		"value",
		"disabled",
		"onInput"
	];
	var AssetCard_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
		__name: "AssetCard",
		props: { asset: {} },
		emits: ["click-image"],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emit = __emit;
			const { sites, cpTrigger, primarySiteId } = useGlobalState();
			const suppressOverwriteWarning = useStorage("altpilot-suppress-overwrite-warning", false);
			const confirmationOpen = /* @__PURE__ */ ref(false);
			const pendingGenerationSiteId = /* @__PURE__ */ ref(null);
			const currentSiteId = computed(() => primarySiteId.value);
			const currentAsset = computed(() => props.asset[currentSiteId.value]);
			const currentSiteHandle = computed(() => {
				return sites.value.find((site) => site.id === currentSiteId.value)?.handle ?? null;
			});
			const charactersRemaining = (siteId) => {
				return 150 - (altTexts[siteId] ?? "").length;
			};
			const { altTexts, hasChanges, hasSiteChanges, saving, save, resetChanges } = useAssetAltEditor(props.asset);
			const { generateForSite, generatingBySite, isGenerationActive, isGenerationFinished } = useAssetGeneration(props.asset);
			const isGeneratingSite = (siteId) => {
				return generatingBySite[siteId] || isGenerationActive(siteId);
			};
			const getTextareaValue = (siteId) => {
				return isGeneratingSite(siteId) ? "..." : altTexts[siteId] ?? "";
			};
			const handleTextareaInput = (siteId, event) => {
				if (isGeneratingSite(siteId)) return;
				altTexts[siteId] = event.target.value;
			};
			const handleGenerateClick = (siteId) => {
				if ((altTexts[siteId] ?? "").trim() === "" || suppressOverwriteWarning.value) {
					generateForSite(siteId);
					return;
				}
				pendingGenerationSiteId.value = siteId;
				confirmationOpen.value = true;
			};
			const handleConfirmOverwrite = () => {
				if (pendingGenerationSiteId.value !== null) {
					generateForSite(pendingGenerationSiteId.value);
					pendingGenerationSiteId.value = null;
				}
			};
			const handleCancelOverwrite = () => {
				pendingGenerationSiteId.value = null;
			};
			const handleSave = async () => {
				if (!hasChanges.value || saving.value) return;
				await save();
			};
			const handleCancel = () => {
				if (saving.value || !hasChanges.value) return;
				resetChanges();
			};
			const cardRef = /* @__PURE__ */ ref(null);
			const { focused } = useFocusWithin(cardRef);
			const { meta_s, ctrl_s } = useMagicKeys({
				passive: false,
				onEventFired(e) {
					if (e.type === "keydown" && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
						if (focused.value) e.preventDefault();
					}
				}
			});
			watch([meta_s, ctrl_s], ([m, c]) => {
				if ((m || c) && focused.value) handleSave();
			});
			return (_ctx, _cache) => {
				return openBlock(), createElementBlock("div", {
					ref_key: "cardRef",
					ref: cardRef,
					class: "relative flex h-full flex-col items-start gap-0 overflow-hidden rounded-[1.25rem] border border-[#ECECEC] bg-white"
				}, [
					createBaseVNode("div", _hoisted_1$11, [
						createBaseVNode("img", {
							class: "aspect-[4/3] h-full w-full cursor-pointer object-cover",
							src: currentAsset.value.url,
							alt: currentAsset.value.title,
							onClick: _cache[0] || (_cache[0] = ($event) => emit("click-image", currentAsset.value.id))
						}, null, 8, _hoisted_2$9),
						unref(cpTrigger) ? (openBlock(), createElementBlock("div", _hoisted_3$8, [createBaseVNode("a", {
							href: `/${unref(cpTrigger)}/assets/edit/${currentAsset.value.id}?site=${currentSiteHandle.value ?? ""}`,
							target: "_blank",
							class: "w-full overflow-x-hidden text-xs text-ellipsis whitespace-nowrap text-white underline"
						}, toDisplayString(currentAsset.value.title), 9, _hoisted_4$7)])) : createCommentVNode("", true),
						createBaseVNode("div", { class: normalizeClass(["absolute top-2 right-2 bottom-2 left-2 flex items-center justify-between rounded-2xl p-4 transition-all duration-300 ease-out", [unref(hasChanges) ? "pointer-events-auto bg-ap-light-green opacity-100" : "pointer-events-none bg-ap-light-green opacity-0"]]) }, [createBaseVNode("button", {
							class: "rounded-full border border-ap-dark-green px-3 text-xl text-ap-dark-green disabled:opacity-60",
							disabled: unref(saving) || !unref(hasChanges),
							onClick: handleSave
						}, toDisplayString(unref(saving) ? "saving…" : "save"), 9, _hoisted_5$4), createBaseVNode("button", {
							class: "text-ap-dark-green disabled:opacity-60",
							disabled: unref(saving) || !unref(hasChanges),
							onClick: handleCancel
						}, " cancel ", 8, _hoisted_6$4)], 2)
					]),
					createBaseVNode("div", _hoisted_7$2, [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(sites), (site) => {
						return openBlock(), createElementBlock("div", {
							key: site.id,
							class: "mb-4 flex w-full gap-0 border-b border-[#ECECEC] last:mb-0 last:border-b-0"
						}, [createBaseVNode("div", _hoisted_8$2, [
							createBaseVNode("div", _hoisted_9$1, toDisplayString(site.language) + ": " + toDisplayString(unref(assetStatusShort)[props.asset[site.id]?.status ?? 0]), 1),
							createBaseVNode("div", { class: normalizeClass(["absolute left-1/2 -translate-x-1/2 text-center text-[#AEAEAE]", charactersRemaining(site.id) < 0 ? "text-ap-red" : ""]) }, toDisplayString(charactersRemaining(site.id)), 3),
							createBaseVNode("button", {
								class: normalizeClass(["mb-1 ml-auto rounded-full border p-1 text-ap-dark-green transition-colors hover:bg-ap-light-green/30", { "bg-ap-light-green/30": unref(generatingBySite)[site.id] || unref(isGenerationActive)(site.id) }]),
								disabled: unref(generatingBySite)[site.id] || unref(isGenerationActive)(site.id),
								onClick: ($event) => handleGenerateClick(site.id)
							}, [(openBlock(), createElementBlock("svg", {
								class: normalizeClass(["regenerate-icon", { "animate-spin": unref(generatingBySite)[site.id] || unref(isGenerationActive)(site.id) }]),
								xmlns: "http://www.w3.org/2000/svg",
								viewBox: "0 0 512 512"
							}, [..._cache[2] || (_cache[2] = [createBaseVNode("path", {
								fill: "currentColor",
								d: "M101.83,133.05c-34.52,34.52-53.94,81.31-54.03,130.13-.18,101.9,82.28,184.65,184.17,184.83l.06-32c-40.35-.07-79.02-16.13-107.56-44.66-59.56-59.55-59.56-156.11-.01-215.67l27.54-27.54v79.87s32,0,32,0V72.14s-135.98-.14-135.98-.14l-.03,32,82.81.09-28.96,28.96M279.97,104c40.35.07,79.02,16.13,107.56,44.66,59.56,59.55,59.56,156.11.01,215.67l-27.54,27.54v-79.87s-32,0-32,0v136s136,0,136,0v-32s-82.88,0-82.88,0l29.05-29.05c34.52-34.52,53.94-81.31,54.03-130.13.18-101.9-82.28-184.65-184.17-184.83l-.06,32"
							}, null, -1)])], 2))], 10, _hoisted_10$1)
						]), createBaseVNode("div", _hoisted_11, [createBaseVNode("textarea", {
							value: getTextareaValue(site.id),
							disabled: isGeneratingSite(site.id),
							onInput: ($event) => handleTextareaInput(site.id, $event),
							class: normalizeClass(["w-full resize-none rounded-lg px-2 py-1 text-base leading-[1.1] text-[#555] transition-colors hover:border-ap-light-green focus:border focus:border-ap-light-green focus:ring-0 focus:outline-none", {
								"textarea-generating-pulse border border-green-500 text-ap-dark-green": isGeneratingSite(site.id),
								"border border-ap-light-green": !isGeneratingSite(site.id) && unref(hasSiteChanges)(site.id),
								"border border-ap-red": !isGeneratingSite(site.id) && !unref(hasSiteChanges)(site.id) && !unref(altTexts)[site.id]?.length,
								"border border-transparent": !isGeneratingSite(site.id) && !unref(hasSiteChanges)(site.id) && !!unref(altTexts)[site.id]?.length,
								"textarea-finish-pulse": !isGeneratingSite(site.id) && unref(isGenerationFinished)(site.id)
							}]),
							rows: "4"
						}, null, 42, _hoisted_12)])]);
					}), 128))]),
					createVNode(OverwriteConfirmationDialog_default, {
						open: confirmationOpen.value,
						"onUpdate:open": _cache[1] || (_cache[1] = ($event) => confirmationOpen.value = $event),
						"site-name": unref(sites).find((s) => s.id === pendingGenerationSiteId.value)?.language ?? "",
						onConfirm: handleConfirmOverwrite,
						onCancel: handleCancelOverwrite
					}, null, 8, ["open", "site-name"])
				], 512);
			};
		}
	});
	//#endregion
	//#region \0plugin-vue:export-helper
	var _plugin_vue_export_helper_default = (sfc, props) => {
		const target = sfc.__vccOpts || sfc;
		for (const [key, val] of props) target[key] = val;
		return target;
	};
	//#endregion
	//#region src/components/AssetCard.vue
	var AssetCard_default = /* @__PURE__ */ _plugin_vue_export_helper_default(AssetCard_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-956fabe0"]]);
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/createContext.js
	/**
	* @param providerComponentName - The name(s) of the component(s) providing the context.
	*
	* There are situations where context can come from multiple components. In such cases, you might need to give an array of component names to provide your context, instead of just a single string.
	*
	* @param contextName The description for injection key symbol.
	*/
	function createContext(providerComponentName, contextName) {
		const symbolDescription = typeof providerComponentName === "string" && !contextName ? `${providerComponentName}Context` : contextName;
		const injectionKey = Symbol(symbolDescription);
		/**
		* @param fallback The context value to return if the injection fails.
		*
		* @throws When context injection failed and no fallback is specified.
		* This happens when the component injecting the context is not a child of the root component providing the context.
		*/
		const injectContext = (fallback) => {
			const context = inject(injectionKey, fallback);
			if (context) return context;
			if (context === null) return context;
			throw new Error(`Injection \`${injectionKey.toString()}\` not found. Component must be used within ${Array.isArray(providerComponentName) ? `one of the following components: ${providerComponentName.join(", ")}` : `\`${providerComponentName}\``}`);
		};
		const provideContext = (contextValue) => {
			provide(injectionKey, contextValue);
			return contextValue;
		};
		return [injectContext, provideContext];
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/getActiveElement.js
	function getActiveElement() {
		let activeElement = document.activeElement;
		if (activeElement == null) return null;
		while (activeElement != null && activeElement.shadowRoot != null && activeElement.shadowRoot.activeElement != null) activeElement = activeElement.shadowRoot.activeElement;
		return activeElement;
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/handleAndDispatchCustomEvent.js
	function handleAndDispatchCustomEvent$1(name, handler, detail) {
		const target = detail.originalEvent.target;
		const event = new CustomEvent(name, {
			bubbles: false,
			cancelable: true,
			detail
		});
		if (handler) target.addEventListener(name, handler, { once: true });
		target.dispatchEvent(event);
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/nullish.js
	function isNullish(value) {
		return value === null || value === void 0;
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/renderSlotFragments.js
	function renderSlotFragments(children) {
		if (!children) return [];
		return children.flatMap((child) => {
			if (child.type === Fragment) return renderSlotFragments(child.children);
			return [child];
		});
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/ConfigProvider/ConfigProvider.js
	var [injectConfigProviderContext, provideConfigProviderContext] = /* @__PURE__ */ createContext("ConfigProvider");
	//#endregion
	//#region node_modules/.pnpm/defu@6.1.7/node_modules/defu/dist/defu.mjs
	function isPlainObject(value) {
		if (value === null || typeof value !== "object") return false;
		const prototype = Object.getPrototypeOf(value);
		if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) return false;
		if (Symbol.iterator in value) return false;
		if (Symbol.toStringTag in value) return Object.prototype.toString.call(value) === "[object Module]";
		return true;
	}
	function _defu(baseObject, defaults, namespace = ".", merger) {
		if (!isPlainObject(defaults)) return _defu(baseObject, {}, namespace, merger);
		const object = { ...defaults };
		for (const key of Object.keys(baseObject)) {
			if (key === "__proto__" || key === "constructor") continue;
			const value = baseObject[key];
			if (value === null || value === void 0) continue;
			if (merger && merger(object, key, value, namespace)) continue;
			if (Array.isArray(value) && Array.isArray(object[key])) object[key] = [...value, ...object[key]];
			else if (isPlainObject(value) && isPlainObject(object[key])) object[key] = _defu(value, object[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
			else object[key] = value;
		}
		return object;
	}
	function createDefu(merger) {
		return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
	}
	var defu = createDefu();
	createDefu((object, key, currentValue) => {
		if (object[key] !== void 0 && typeof currentValue === "function") {
			object[key] = currentValue(object[key]);
			return true;
		}
	});
	createDefu((object, key, currentValue) => {
		if (Array.isArray(object[key]) && typeof currentValue === "function") {
			object[key] = currentValue(object[key]);
			return true;
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/useBodyScrollLock.js
	var useBodyLockStackCount = createSharedComposable(() => {
		const map = /* @__PURE__ */ ref(/* @__PURE__ */ new Map());
		const initialOverflow = /* @__PURE__ */ ref();
		const locked = computed(() => {
			for (const value of map.value.values()) if (value) return true;
			return false;
		});
		const context = injectConfigProviderContext({ scrollBody: /* @__PURE__ */ ref(true) });
		let stopTouchMoveListener = null;
		const resetBodyStyle = () => {
			document.body.style.paddingRight = "";
			document.body.style.marginRight = "";
			document.body.style.pointerEvents = "";
			document.documentElement.style.removeProperty("--scrollbar-width");
			document.body.style.overflow = initialOverflow.value ?? "";
			isIOS && stopTouchMoveListener?.();
			initialOverflow.value = void 0;
		};
		watch(locked, (val, oldVal) => {
			if (!isClient) return;
			if (!val) {
				if (oldVal) resetBodyStyle();
				return;
			}
			if (initialOverflow.value === void 0) initialOverflow.value = document.body.style.overflow;
			const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			const defaultConfig = {
				padding: verticalScrollbarWidth,
				margin: 0
			};
			const config = context.scrollBody?.value ? typeof context.scrollBody.value === "object" ? defu({
				padding: context.scrollBody.value.padding === true ? verticalScrollbarWidth : context.scrollBody.value.padding,
				margin: context.scrollBody.value.margin === true ? verticalScrollbarWidth : context.scrollBody.value.margin
			}, defaultConfig) : defaultConfig : {
				padding: 0,
				margin: 0
			};
			if (verticalScrollbarWidth > 0) {
				document.body.style.paddingRight = typeof config.padding === "number" ? `${config.padding}px` : String(config.padding);
				document.body.style.marginRight = typeof config.margin === "number" ? `${config.margin}px` : String(config.margin);
				document.documentElement.style.setProperty("--scrollbar-width", `${verticalScrollbarWidth}px`);
				document.body.style.overflow = "hidden";
			}
			if (isIOS) stopTouchMoveListener = useEventListener(document, "touchmove", (e) => preventDefault(e), { passive: false });
			nextTick(() => {
				if (!locked.value) return;
				document.body.style.pointerEvents = "none";
				document.body.style.overflow = "hidden";
			});
		}, {
			immediate: true,
			flush: "sync"
		});
		return map;
	});
	function useBodyScrollLock(initialState) {
		const id = Math.random().toString(36).substring(2, 7);
		const map = useBodyLockStackCount();
		map.value.set(id, initialState ?? false);
		const locked = computed({
			get: () => map.value.get(id) ?? false,
			set: (value) => map.value.set(id, value)
		});
		tryOnBeforeUnmount(() => {
			map.value.delete(id);
		});
		return locked;
	}
	function checkOverflowScroll(ele) {
		const style = window.getComputedStyle(ele);
		if (style.overflowX === "scroll" || style.overflowY === "scroll" || style.overflowX === "auto" && ele.clientWidth < ele.scrollWidth || style.overflowY === "auto" && ele.clientHeight < ele.scrollHeight) return true;
		else {
			const parent = ele.parentNode;
			if (!(parent instanceof Element) || parent.tagName === "BODY") return false;
			return checkOverflowScroll(parent);
		}
	}
	function preventDefault(rawEvent) {
		const e = rawEvent || window.event;
		const _target = e.target;
		if (_target instanceof Element && checkOverflowScroll(_target)) return false;
		if (e.touches.length > 1) return true;
		if (e.preventDefault && e.cancelable) e.preventDefault();
		return false;
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/useEmitAsProps.js
	/**
	* The `useEmitAsProps` function is a TypeScript utility that converts emitted events into props for a
	* Vue component.
	* @param emit - The `emit` parameter is a function that is used to emit events from a component. It
	* takes two parameters: `name` which is the name of the event to be emitted, and `...args` which are
	* the arguments to be passed along with the event.
	* @returns The function `useEmitAsProps` returns an object that maps event names to functions that
	* call the `emit` function with the corresponding event name and arguments.
	*/
	function useEmitAsProps(emit) {
		const vm = getCurrentInstance();
		const events = vm?.type.emits;
		const result = {};
		if (!events?.length) console.warn(`No emitted event found. Please check component: ${vm?.type.__name}`);
		events?.forEach((ev) => {
			result[toHandlerKey(camelize$1(ev))] = (...arg) => emit(ev, ...arg);
		});
		return result;
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/useForwardExpose.js
	function useForwardExpose() {
		const instance = getCurrentInstance();
		const currentRef = /* @__PURE__ */ ref();
		const currentElement = computed(() => resolveCurrentElement());
		onUpdated(() => {
			if (currentElement.value !== resolveCurrentElement()) triggerRef(currentRef);
		});
		function resolveCurrentElement() {
			return currentRef.value && "$el" in currentRef.value && ["#text", "#comment"].includes(currentRef.value.$el.nodeName) ? currentRef.value.$el.nextElementSibling : unrefElement(currentRef);
		}
		const localExpose = Object.assign({}, instance.exposed);
		const ret = {};
		for (const key in instance.props) Object.defineProperty(ret, key, {
			enumerable: true,
			configurable: true,
			get: () => instance.props[key]
		});
		if (Object.keys(localExpose).length > 0) for (const key in localExpose) Object.defineProperty(ret, key, {
			enumerable: true,
			configurable: true,
			get: () => localExpose[key]
		});
		Object.defineProperty(ret, "$el", {
			enumerable: true,
			configurable: true,
			get: () => instance.vnode.el
		});
		instance.exposed = ret;
		function forwardRef(ref$1) {
			currentRef.value = ref$1;
			if (!ref$1) return;
			Object.defineProperty(ret, "$el", {
				enumerable: true,
				configurable: true,
				get: () => ref$1 instanceof Element ? ref$1 : ref$1.$el
			});
			if (!(ref$1 instanceof Element) && !Object.hasOwn(ref$1, "$el")) {
				const childExposed = ref$1.$.exposed;
				const merged = Object.assign({}, ret);
				for (const key in childExposed) Object.defineProperty(merged, key, {
					enumerable: true,
					configurable: true,
					get: () => childExposed[key]
				});
				instance.exposed = merged;
			}
		}
		return {
			forwardRef,
			currentRef,
			currentElement
		};
	}
	//#endregion
	//#region node_modules/.pnpm/aria-hidden@1.2.6/node_modules/aria-hidden/dist/es2015/index.js
	var getDefaultParent = function(originalTarget) {
		if (typeof document === "undefined") return null;
		return (Array.isArray(originalTarget) ? originalTarget[0] : originalTarget).ownerDocument.body;
	};
	var counterMap = /* @__PURE__ */ new WeakMap();
	var uncontrolledNodes = /* @__PURE__ */ new WeakMap();
	var markerMap = {};
	var lockCount = 0;
	var unwrapHost = function(node) {
		return node && (node.host || unwrapHost(node.parentNode));
	};
	var correctTargets = function(parent, targets) {
		return targets.map(function(target) {
			if (parent.contains(target)) return target;
			var correctedTarget = unwrapHost(target);
			if (correctedTarget && parent.contains(correctedTarget)) return correctedTarget;
			console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
			return null;
		}).filter(function(x) {
			return Boolean(x);
		});
	};
	/**
	* Marks everything except given node(or nodes) as aria-hidden
	* @param {Element | Element[]} originalTarget - elements to keep on the page
	* @param [parentNode] - top element, defaults to document.body
	* @param {String} [markerName] - a special attribute to mark every node
	* @param {String} [controlAttribute] - html Attribute to control
	* @return {Undo} undo command
	*/
	var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
		var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
		if (!markerMap[markerName]) markerMap[markerName] = /* @__PURE__ */ new WeakMap();
		var markerCounter = markerMap[markerName];
		var hiddenNodes = [];
		var elementsToKeep = /* @__PURE__ */ new Set();
		var elementsToStop = new Set(targets);
		var keep = function(el) {
			if (!el || elementsToKeep.has(el)) return;
			elementsToKeep.add(el);
			keep(el.parentNode);
		};
		targets.forEach(keep);
		var deep = function(parent) {
			if (!parent || elementsToStop.has(parent)) return;
			Array.prototype.forEach.call(parent.children, function(node) {
				if (elementsToKeep.has(node)) deep(node);
				else try {
					var attr = node.getAttribute(controlAttribute);
					var alreadyHidden = attr !== null && attr !== "false";
					var counterValue = (counterMap.get(node) || 0) + 1;
					var markerValue = (markerCounter.get(node) || 0) + 1;
					counterMap.set(node, counterValue);
					markerCounter.set(node, markerValue);
					hiddenNodes.push(node);
					if (counterValue === 1 && alreadyHidden) uncontrolledNodes.set(node, true);
					if (markerValue === 1) node.setAttribute(markerName, "true");
					if (!alreadyHidden) node.setAttribute(controlAttribute, "true");
				} catch (e) {
					console.error("aria-hidden: cannot operate on ", node, e);
				}
			});
		};
		deep(parentNode);
		elementsToKeep.clear();
		lockCount++;
		return function() {
			hiddenNodes.forEach(function(node) {
				var counterValue = counterMap.get(node) - 1;
				var markerValue = markerCounter.get(node) - 1;
				counterMap.set(node, counterValue);
				markerCounter.set(node, markerValue);
				if (!counterValue) {
					if (!uncontrolledNodes.has(node)) node.removeAttribute(controlAttribute);
					uncontrolledNodes.delete(node);
				}
				if (!markerValue) node.removeAttribute(markerName);
			});
			lockCount--;
			if (!lockCount) {
				counterMap = /* @__PURE__ */ new WeakMap();
				counterMap = /* @__PURE__ */ new WeakMap();
				uncontrolledNodes = /* @__PURE__ */ new WeakMap();
				markerMap = {};
			}
		};
	};
	/**
	* Marks everything except given node(or nodes) as aria-hidden
	* @param {Element | Element[]} originalTarget - elements to keep on the page
	* @param [parentNode] - top element, defaults to document.body
	* @param {String} [markerName] - a special attribute to mark every node
	* @return {Undo} undo command
	*/
	var hideOthers = function(originalTarget, parentNode, markerName) {
		if (markerName === void 0) markerName = "data-aria-hidden";
		var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
		var activeParentNode = parentNode || getDefaultParent(originalTarget);
		if (!activeParentNode) return function() {
			return null;
		};
		targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
		return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
	};
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/useHideOthers.js
	/**
	* The `useHideOthers` function is a TypeScript function that takes a target element reference and
	* hides all other elements in ARIA when the target element is present, and restores the visibility of the
	* hidden elements when the target element is removed.
	* @param {MaybeElementRef} target - The `target` parameter is a reference to the element that you want
	* to hide other elements when it is clicked or focused.
	*/
	function useHideOthers(target) {
		let undo;
		watch(() => unrefElement(target), (el) => {
			let isInsideClosedPopover = false;
			try {
				isInsideClosedPopover = !!el?.closest("[popover]:not(:popover-open)");
			} catch {}
			if (el && !isInsideClosedPopover) undo = hideOthers(el);
			else if (undo) undo();
		});
		onUnmounted(() => {
			if (undo) undo();
		});
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/useId.js
	var count = 0;
	/**
	* The `useId` function generates a unique identifier using a provided deterministic ID or a default
	* one prefixed with "reka-", or the provided one via `useId` props from `<ConfigProvider>`.
	* @param {string | null | undefined} [deterministicId] - The `useId` function you provided takes an
	* optional parameter `deterministicId`, which can be a string, null, or undefined. If
	* `deterministicId` is provided, the function will return it. Otherwise, it will generate an id using
	* the `useId` function obtained
	*/
	function useId(deterministicId, prefix = "reka") {
		if (deterministicId) return deterministicId;
		let id;
		if ("useId" in vue_runtime_esm_bundler_exports) id = useId$1?.();
		else id = injectConfigProviderContext({ useId: void 0 }).useId?.() ?? `${++count}`;
		return prefix ? `${prefix}-${id}` : id;
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/shared/useStateMachine.js
	/**
	* The `useStateMachine` function is a TypeScript function that creates a state machine and returns the
	* current state and a dispatch function to update the state based on events.
	* @param initialState - The `initialState` parameter is the initial state of the state machine. It
	* represents the starting point of the state machine's state.
	* @param machine - The `machine` parameter is an object that represents a state machine. It should
	* have keys that correspond to the possible states of the machine, and the values should be objects
	* that represent the possible events and their corresponding next states.
	* @returns The `useStateMachine` function returns an object with two properties: `state` and
	* `dispatch`.
	*/
	function useStateMachine(initialState, machine) {
		const state = /* @__PURE__ */ ref(initialState);
		function reducer(event) {
			return machine[state.value][event] ?? state.value;
		}
		const dispatch = (event) => {
			state.value = reducer(event);
		};
		return {
			state,
			dispatch
		};
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Presence/usePresence.js
	function usePresence(present, node) {
		const stylesRef = /* @__PURE__ */ ref({});
		const prevAnimationNameRef = /* @__PURE__ */ ref("none");
		const prevPresentRef = /* @__PURE__ */ ref(present);
		const initialState = present.value ? "mounted" : "unmounted";
		let timeoutId;
		const ownerWindow = node.value?.ownerDocument.defaultView ?? defaultWindow;
		const { state, dispatch } = useStateMachine(initialState, {
			mounted: {
				UNMOUNT: "unmounted",
				ANIMATION_OUT: "unmountSuspended"
			},
			unmountSuspended: {
				MOUNT: "mounted",
				ANIMATION_END: "unmounted"
			},
			unmounted: { MOUNT: "mounted" }
		});
		const dispatchCustomEvent = (name) => {
			if (isClient) {
				const customEvent = new CustomEvent(name, {
					bubbles: false,
					cancelable: false
				});
				node.value?.dispatchEvent(customEvent);
			}
		};
		watch(present, async (currentPresent, prevPresent) => {
			const hasPresentChanged = prevPresent !== currentPresent;
			await nextTick();
			if (hasPresentChanged) {
				const prevAnimationName = prevAnimationNameRef.value;
				const currentAnimationName = getAnimationName(node.value);
				if (currentPresent) {
					dispatch("MOUNT");
					dispatchCustomEvent("enter");
					if (currentAnimationName === "none") dispatchCustomEvent("after-enter");
				} else if (currentAnimationName === "none" || currentAnimationName === "undefined" || stylesRef.value?.display === "none") {
					dispatch("UNMOUNT");
					dispatchCustomEvent("leave");
					dispatchCustomEvent("after-leave");
				} else if (prevPresent && prevAnimationName !== currentAnimationName) {
					dispatch("ANIMATION_OUT");
					dispatchCustomEvent("leave");
				} else {
					dispatch("UNMOUNT");
					dispatchCustomEvent("after-leave");
				}
			}
		}, { immediate: true });
		/**
		* Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
		* event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
		* make sure we only trigger ANIMATION_END for the currently active animation.
		*/
		const handleAnimationEnd = (event) => {
			const currentAnimationName = getAnimationName(node.value);
			const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
			const directionName = state.value === "mounted" ? "enter" : "leave";
			if (event.target === node.value && isCurrentAnimation) {
				dispatchCustomEvent(`after-${directionName}`);
				dispatch("ANIMATION_END");
				if (!prevPresentRef.value) {
					const currentFillMode = node.value.style.animationFillMode;
					node.value.style.animationFillMode = "forwards";
					timeoutId = ownerWindow?.setTimeout(() => {
						if (node.value?.style.animationFillMode === "forwards") node.value.style.animationFillMode = currentFillMode;
					});
				}
			}
			if (event.target === node.value && currentAnimationName === "none") dispatch("ANIMATION_END");
		};
		const handleAnimationStart = (event) => {
			if (event.target === node.value) prevAnimationNameRef.value = getAnimationName(node.value);
		};
		const watcher = watch(node, (newNode, oldNode) => {
			if (newNode) {
				stylesRef.value = getComputedStyle(newNode);
				newNode.addEventListener("animationstart", handleAnimationStart);
				newNode.addEventListener("animationcancel", handleAnimationEnd);
				newNode.addEventListener("animationend", handleAnimationEnd);
			} else {
				dispatch("ANIMATION_END");
				if (timeoutId !== void 0) ownerWindow?.clearTimeout(timeoutId);
				oldNode?.removeEventListener("animationstart", handleAnimationStart);
				oldNode?.removeEventListener("animationcancel", handleAnimationEnd);
				oldNode?.removeEventListener("animationend", handleAnimationEnd);
			}
		}, { immediate: true });
		const stateWatcher = watch(state, () => {
			const currentAnimationName = getAnimationName(node.value);
			prevAnimationNameRef.value = state.value === "mounted" ? currentAnimationName : "none";
		});
		onUnmounted(() => {
			watcher();
			stateWatcher();
		});
		return { isPresent: computed(() => ["mounted", "unmountSuspended"].includes(state.value)) };
	}
	function getAnimationName(node) {
		return node ? getComputedStyle(node).animationName || "none" : "none";
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Presence/Presence.js
	var Presence_default = /* @__PURE__ */ defineComponent({
		name: "Presence",
		props: {
			present: {
				type: Boolean,
				required: true
			},
			forceMount: { type: Boolean }
		},
		slots: {},
		setup(props, { slots, expose }) {
			const { present, forceMount } = /* @__PURE__ */ toRefs(props);
			const node = /* @__PURE__ */ ref();
			const { isPresent } = usePresence(present, node);
			expose({ present: isPresent });
			let children = slots.default({ present: isPresent.value });
			children = renderSlotFragments(children || []);
			const instance = getCurrentInstance();
			if (children && children?.length > 1) {
				const componentName = instance?.parent?.type.name ? `<${instance.parent.type.name} />` : "component";
				throw new Error([
					`Detected an invalid children for \`${componentName}\` for  \`Presence\` component.`,
					"",
					"Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
					"You can apply a few solutions:",
					["Provide a single child element so that `presence` directive attach correctly.", "Ensure the first child is an actual element instead of a raw text node or comment node."].map((line) => `  - ${line}`).join("\n")
				].join("\n"));
			}
			return () => {
				if (forceMount.value || present.value || isPresent.value) return h(slots.default({ present: isPresent.value })[0], { ref: (v) => {
					const el = unrefElement(v);
					if (typeof el?.hasAttribute === "undefined") return el;
					if (el?.hasAttribute("data-reka-popper-content-wrapper")) node.value = el.firstElementChild;
					else node.value = el;
					return el;
				} });
				else return null;
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Primitive/Slot.js
	var Slot = /* @__PURE__ */ defineComponent({
		name: "PrimitiveSlot",
		inheritAttrs: false,
		setup(_, { attrs, slots }) {
			return () => {
				if (!slots.default) return null;
				const children = renderSlotFragments(slots.default());
				const firstNonCommentChildrenIndex = children.findIndex((child) => child.type !== Comment);
				if (firstNonCommentChildrenIndex === -1) return children;
				const firstNonCommentChildren = children[firstNonCommentChildrenIndex];
				delete firstNonCommentChildren.props?.ref;
				const mergedProps = firstNonCommentChildren.props ? mergeProps(attrs, firstNonCommentChildren.props) : attrs;
				const cloned = cloneVNode({
					...firstNonCommentChildren,
					props: {}
				}, mergedProps);
				if (children.length === 1) return cloned;
				children[firstNonCommentChildrenIndex] = cloned;
				return children;
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Primitive/Primitive.js
	var SELF_CLOSING_TAGS = [
		"area",
		"img",
		"input"
	];
	var Primitive = /* @__PURE__ */ defineComponent({
		name: "Primitive",
		inheritAttrs: false,
		props: {
			asChild: {
				type: Boolean,
				default: false
			},
			as: {
				type: [String, Object],
				default: "div"
			}
		},
		setup(props, { attrs, slots }) {
			const asTag = props.asChild ? "template" : props.as;
			if (typeof asTag === "string" && SELF_CLOSING_TAGS.includes(asTag)) return () => h(asTag, attrs);
			if (asTag !== "template") return () => h(props.as, attrs, { default: slots.default });
			return () => h(Slot, attrs, { default: slots.default });
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Primitive/usePrimitiveElement.js
	function usePrimitiveElement() {
		const primitiveElement = /* @__PURE__ */ ref();
		return {
			primitiveElement,
			currentElement: computed(() => ["#text", "#comment"].includes(primitiveElement.value?.$el.nodeName) ? primitiveElement.value?.$el.nextElementSibling : unrefElement(primitiveElement))
		};
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogRoot.js
	var [injectDialogRootContext, provideDialogRootContext] = /* @__PURE__ */ createContext("DialogRoot");
	var DialogRoot_default = /* @__PURE__ */ defineComponent({
		inheritAttrs: false,
		__name: "DialogRoot",
		props: {
			open: {
				type: Boolean,
				required: false,
				default: void 0
			},
			defaultOpen: {
				type: Boolean,
				required: false,
				default: false
			},
			modal: {
				type: Boolean,
				required: false,
				default: true
			}
		},
		emits: ["update:open"],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const open = useVModel(props, "open", __emit, {
				defaultValue: props.defaultOpen,
				passive: props.open === void 0
			});
			const triggerElement = /* @__PURE__ */ ref();
			const contentElement = /* @__PURE__ */ ref();
			const { modal } = /* @__PURE__ */ toRefs(props);
			provideDialogRootContext({
				open,
				modal,
				openModal: () => {
					open.value = true;
				},
				onOpenChange: (value) => {
					open.value = value;
				},
				onOpenToggle: () => {
					open.value = !open.value;
				},
				contentId: "",
				titleId: "",
				descriptionId: "",
				triggerElement,
				contentElement
			});
			return (_ctx, _cache) => {
				return renderSlot(_ctx.$slots, "default", {
					open: unref(open),
					close: () => open.value = false
				});
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogClose.js
	var DialogClose_default = /* @__PURE__ */ defineComponent({
		__name: "DialogClose",
		props: {
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false,
				default: "button"
			}
		},
		setup(__props) {
			const props = __props;
			useForwardExpose();
			const rootContext = injectDialogRootContext();
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), mergeProps(props, {
					type: _ctx.as === "button" ? "button" : void 0,
					onClick: _cache[0] || (_cache[0] = ($event) => unref(rootContext).onOpenChange(false))
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, ["type"]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/DismissableLayer/utils.js
	var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
	var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
	function isLayerExist(layerElement, targetElement) {
		if (!(targetElement instanceof Element)) return false;
		const targetLayer = targetElement.closest("[data-dismissable-layer]");
		const mainLayer = layerElement.dataset.dismissableLayer === "" ? layerElement : layerElement.querySelector("[data-dismissable-layer]");
		const nodeList = Array.from(layerElement.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
		if (targetLayer && (mainLayer === targetLayer || nodeList.indexOf(mainLayer) < nodeList.indexOf(targetLayer))) return true;
		else return false;
	}
	/**
	* Listens for `pointerdown` outside a DOM subtree. We use `pointerdown` rather than `pointerup`
	* to mimic layer dismissing behaviour present in OS.
	* Returns props to pass to the node we want to check for outside events.
	*/
	function usePointerDownOutside(onPointerDownOutside, element, enabled = true) {
		const ownerDocument = element?.value?.ownerDocument ?? globalThis?.document;
		const isPointerInsideDOMTree = /* @__PURE__ */ ref(false);
		const handleClickRef = /* @__PURE__ */ ref(() => {});
		watchEffect((cleanupFn) => {
			if (!isClient || !toValue(enabled)) return;
			const handlePointerDown = async (event) => {
				const target = event.target;
				if (!element?.value || !target) return;
				if (isLayerExist(element.value, target)) {
					isPointerInsideDOMTree.value = false;
					return;
				}
				if (event.target && !isPointerInsideDOMTree.value) {
					const eventDetail = { originalEvent: event };
					function handleAndDispatchPointerDownOutsideEvent() {
						handleAndDispatchCustomEvent$1(POINTER_DOWN_OUTSIDE, onPointerDownOutside, eventDetail);
					}
					/**
					* On touch devices, we need to wait for a click event because browsers implement
					* a ~350ms delay between the time the user stops touching the display and when the
					* browser executes events. We need to ensure we don't reactivate pointer-events within
					* this timeframe otherwise the browser may execute events that should have been prevented.
					*
					* Additionally, this also lets us deal automatically with cancellations when a click event
					* isn't raised because the page was considered scrolled/drag-scrolled, long-pressed, etc.
					*
					* This is why we also continuously remove the previous listener, because we cannot be
					* certain that it was raised, and therefore cleaned-up.
					*/
					if (event.pointerType === "touch") {
						ownerDocument.removeEventListener("click", handleClickRef.value);
						handleClickRef.value = handleAndDispatchPointerDownOutsideEvent;
						ownerDocument.addEventListener("click", handleClickRef.value, { once: true });
					} else handleAndDispatchPointerDownOutsideEvent();
				} else ownerDocument.removeEventListener("click", handleClickRef.value);
				isPointerInsideDOMTree.value = false;
			};
			/**
			* if this hook executes in a component that mounts via a `pointerdown` event, the event
			* would bubble up to the document and trigger a `pointerDownOutside` event. We avoid
			* this by delaying the event listener registration on the document.
			* This is how the DOM works, ie:
			* ```
			* button.addEventListener('pointerdown', () => {
			*   console.log('I will log');
			*   document.addEventListener('pointerdown', () => {
			*     console.log('I will also log');
			*   })
			* });
			*/
			const timerId = window.setTimeout(() => {
				ownerDocument.addEventListener("pointerdown", handlePointerDown);
			}, 0);
			cleanupFn(() => {
				window.clearTimeout(timerId);
				ownerDocument.removeEventListener("pointerdown", handlePointerDown);
				ownerDocument.removeEventListener("click", handleClickRef.value);
			});
		});
		return { onPointerDownCapture: () => {
			if (!toValue(enabled)) return;
			isPointerInsideDOMTree.value = true;
		} };
	}
	/**
	* Listens for when focus happens outside a DOM subtree.
	* Returns props to pass to the root (node) of the subtree we want to check.
	*/
	function useFocusOutside(onFocusOutside, element, enabled = true) {
		const ownerDocument = element?.value?.ownerDocument ?? globalThis?.document;
		const isFocusInsideDOMTree = /* @__PURE__ */ ref(false);
		watchEffect((cleanupFn) => {
			if (!isClient || !toValue(enabled)) return;
			const handleFocus = async (event) => {
				if (!element?.value) return;
				await nextTick();
				await nextTick();
				const target = event.target;
				if (!element.value || !target || isLayerExist(element.value, target)) return;
				if (event.target && !isFocusInsideDOMTree.value) handleAndDispatchCustomEvent$1(FOCUS_OUTSIDE, onFocusOutside, { originalEvent: event });
			};
			ownerDocument.addEventListener("focusin", handleFocus);
			cleanupFn(() => ownerDocument.removeEventListener("focusin", handleFocus));
		});
		return {
			onFocusCapture: () => {
				if (!toValue(enabled)) return;
				isFocusInsideDOMTree.value = true;
			},
			onBlurCapture: () => {
				if (!toValue(enabled)) return;
				isFocusInsideDOMTree.value = false;
			}
		};
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/DismissableLayer/DismissableLayer.js
	var context = /* @__PURE__ */ reactive({
		layersRoot: /* @__PURE__ */ new Set(),
		layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
		originalBodyPointerEvents: void 0,
		branches: /* @__PURE__ */ new Set()
	});
	var DismissableLayer_default = /* @__PURE__ */ defineComponent({
		__name: "DismissableLayer",
		props: {
			disableOutsidePointerEvents: {
				type: Boolean,
				required: false,
				default: false
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		emits: [
			"escapeKeyDown",
			"pointerDownOutside",
			"focusOutside",
			"interactOutside",
			"dismiss"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emits = __emit;
			const { forwardRef, currentElement: layerElement } = useForwardExpose();
			const ownerDocument = computed(() => layerElement.value?.ownerDocument ?? globalThis.document);
			const layers = computed(() => context.layersRoot);
			const index = computed(() => {
				return layerElement.value ? Array.from(layers.value).indexOf(layerElement.value) : -1;
			});
			const isBodyPointerEventsDisabled = computed(() => {
				return context.layersWithOutsidePointerEventsDisabled.size > 0;
			});
			const isPointerEventsEnabled = computed(() => {
				const localLayers = Array.from(layers.value);
				const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
				const highestLayerWithOutsidePointerEventsDisabledIndex = localLayers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
				return index.value >= highestLayerWithOutsidePointerEventsDisabledIndex;
			});
			const pointerDownOutside = usePointerDownOutside(async (event) => {
				const isPointerDownOnBranch = [...context.branches].some((branch) => branch?.contains(event.target));
				if (!isPointerEventsEnabled.value || isPointerDownOnBranch) return;
				emits("pointerDownOutside", event);
				emits("interactOutside", event);
				await nextTick();
				if (!event.defaultPrevented) emits("dismiss");
			}, layerElement);
			const focusOutside = useFocusOutside((event) => {
				if ([...context.branches].some((branch) => branch?.contains(event.target))) return;
				emits("focusOutside", event);
				emits("interactOutside", event);
				if (!event.defaultPrevented) emits("dismiss");
			}, layerElement);
			onKeyStroke("Escape", (event) => {
				if (!(index.value === layers.value.size - 1)) return;
				emits("escapeKeyDown", event);
				if (!event.defaultPrevented) emits("dismiss");
			});
			watchEffect((cleanupFn) => {
				if (!layerElement.value) return;
				if (props.disableOutsidePointerEvents) {
					if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
						context.originalBodyPointerEvents = ownerDocument.value.body.style.pointerEvents;
						ownerDocument.value.body.style.pointerEvents = "none";
					}
					context.layersWithOutsidePointerEventsDisabled.add(layerElement.value);
				}
				layers.value.add(layerElement.value);
				cleanupFn(() => {
					if (props.disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1 && !isNullish(context.originalBodyPointerEvents)) ownerDocument.value.body.style.pointerEvents = context.originalBodyPointerEvents;
				});
			});
			watchEffect((cleanupFn) => {
				cleanupFn(() => {
					if (!layerElement.value) return;
					layers.value.delete(layerElement.value);
					context.layersWithOutsidePointerEventsDisabled.delete(layerElement.value);
				});
			});
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), {
					ref: unref(forwardRef),
					"as-child": _ctx.asChild,
					as: _ctx.as,
					"data-dismissable-layer": "",
					style: normalizeStyle({ pointerEvents: isBodyPointerEventsDisabled.value ? isPointerEventsEnabled.value ? "auto" : "none" : void 0 }),
					onFocusCapture: unref(focusOutside).onFocusCapture,
					onBlurCapture: unref(focusOutside).onBlurCapture,
					onPointerdownCapture: unref(pointerDownOutside).onPointerDownCapture
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"as-child",
					"as",
					"style",
					"onFocusCapture",
					"onBlurCapture",
					"onPointerdownCapture"
				]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/DismissableLayer/DismissableLayerBranch.js
	var DismissableLayerBranch_default = /* @__PURE__ */ defineComponent({
		__name: "DismissableLayerBranch",
		props: {
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		setup(__props) {
			const props = __props;
			const { forwardRef, currentElement } = useForwardExpose();
			onMounted(() => {
				context.branches.add(currentElement.value);
			});
			onUnmounted(() => {
				context.branches.delete(currentElement.value);
			});
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), mergeProps({ ref: unref(forwardRef) }, props), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/FocusScope/stack.js
	var useFocusStackState = createGlobalState(() => {
		return /* @__PURE__ */ ref([]);
	});
	function createFocusScopesStack() {
		/** A stack of focus scopes, with the active one at the top */
		const stack = useFocusStackState();
		return {
			add(focusScope) {
				const activeFocusScope = stack.value[0];
				if (focusScope !== activeFocusScope) activeFocusScope?.pause();
				stack.value = arrayRemove(stack.value, focusScope);
				stack.value.unshift(focusScope);
			},
			remove(focusScope) {
				stack.value = arrayRemove(stack.value, focusScope);
				stack.value[0]?.resume();
			}
		};
	}
	function arrayRemove(array, item) {
		const updatedArray = [...array];
		const index = updatedArray.indexOf(item);
		if (index !== -1) updatedArray.splice(index, 1);
		return updatedArray;
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/FocusScope/utils.js
	var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
	var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
	var EVENT_OPTIONS = {
		bubbles: false,
		cancelable: true
	};
	/**
	* Attempts focusing the first element in a list of candidates.
	* Stops when focus has actually moved.
	*/
	function focusFirst(candidates, { select = false } = {}) {
		const previouslyFocusedElement = getActiveElement();
		for (const candidate of candidates) {
			focus(candidate, { select });
			if (getActiveElement() !== previouslyFocusedElement) return true;
		}
	}
	/**
	* Returns the first and last tabbable elements inside a container.
	*/
	function getTabbableEdges(container) {
		const candidates = getTabbableCandidates(container);
		return [findVisible(candidates, container), findVisible(candidates.reverse(), container)];
	}
	/**
	* Returns a list of potential tabbable candidates.
	*
	* NOTE: This is only a close approximation. For example it doesn't take into account cases like when
	* elements are not visible. This cannot be worked out easily by just reading a property, but rather
	* necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
	*
	* See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
	* Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
	*/
	function getTabbableCandidates(container) {
		const nodes = [];
		const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
			const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
			if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
			return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
		} });
		while (walker.nextNode()) nodes.push(walker.currentNode);
		return nodes;
	}
	/**
	* Returns the first visible element in a list.
	* NOTE: Only checks visibility up to the `container`.
	*/
	function findVisible(elements, container) {
		for (const element of elements) if (!isHidden(element, { upTo: container })) return element;
	}
	function isHidden(node, { upTo }) {
		if (getComputedStyle(node).visibility === "hidden") return true;
		while (node) {
			if (upTo !== void 0 && node === upTo) return false;
			if (getComputedStyle(node).display === "none") return true;
			node = node.parentElement;
		}
		return false;
	}
	function isSelectableInput(element) {
		return element instanceof HTMLInputElement && "select" in element;
	}
	function focus(element, { select = false } = {}) {
		if (element && element.focus) {
			const previouslyFocusedElement = getActiveElement();
			element.focus({ preventScroll: true });
			if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
		}
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/FocusScope/FocusScope.js
	var FocusScope_default = /* @__PURE__ */ defineComponent({
		__name: "FocusScope",
		props: {
			loop: {
				type: Boolean,
				required: false,
				default: false
			},
			trapped: {
				type: Boolean,
				required: false,
				default: false
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		emits: ["mountAutoFocus", "unmountAutoFocus"],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emits = __emit;
			const { currentRef, currentElement } = useForwardExpose();
			const lastFocusedElementRef = /* @__PURE__ */ ref(null);
			const focusScopesStack = createFocusScopesStack();
			const focusScope = /* @__PURE__ */ reactive({
				paused: false,
				pause() {
					this.paused = true;
				},
				resume() {
					this.paused = false;
				}
			});
			watchEffect((cleanupFn) => {
				if (!isClient) return;
				const container = currentElement.value;
				if (!props.trapped) return;
				function handleFocusIn(event) {
					if (focusScope.paused || !container) return;
					const target = event.target;
					if (container.contains(target)) lastFocusedElementRef.value = target;
					else focus(lastFocusedElementRef.value, { select: true });
				}
				function handleFocusOut(event) {
					if (focusScope.paused || !container) return;
					const relatedTarget = event.relatedTarget;
					if (relatedTarget === null) return;
					if (!container.contains(relatedTarget)) focus(lastFocusedElementRef.value, { select: true });
				}
				function handleMutations(mutations) {
					const lastFocusedElement = lastFocusedElementRef.value;
					if (lastFocusedElement === null) return;
					if (!mutations.some((m) => m.removedNodes.length > 0)) return;
					if (!container.contains(lastFocusedElement)) focus(container);
				}
				document.addEventListener("focusin", handleFocusIn);
				document.addEventListener("focusout", handleFocusOut);
				const mutationObserver = new MutationObserver(handleMutations);
				if (container) mutationObserver.observe(container, {
					childList: true,
					subtree: true
				});
				cleanupFn(() => {
					document.removeEventListener("focusin", handleFocusIn);
					document.removeEventListener("focusout", handleFocusOut);
					mutationObserver.disconnect();
				});
			});
			watchEffect(async (cleanupFn) => {
				const container = currentElement.value;
				await nextTick();
				if (!container) return;
				focusScopesStack.add(focusScope);
				const previouslyFocusedElement = getActiveElement();
				if (!container.contains(previouslyFocusedElement)) {
					const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
					container.addEventListener(AUTOFOCUS_ON_MOUNT, (ev) => emits("mountAutoFocus", ev));
					container.dispatchEvent(mountEvent);
					if (!mountEvent.defaultPrevented) {
						focusFirst(getTabbableCandidates(container), { select: true });
						if (getActiveElement() === previouslyFocusedElement) focus(container);
					}
				}
				cleanupFn(() => {
					container.removeEventListener(AUTOFOCUS_ON_MOUNT, (ev) => emits("mountAutoFocus", ev));
					const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
					const unmountEventHandler = (ev) => {
						emits("unmountAutoFocus", ev);
					};
					container.addEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler);
					container.dispatchEvent(unmountEvent);
					setTimeout(() => {
						if (!unmountEvent.defaultPrevented) focus(previouslyFocusedElement ?? document.body, { select: true });
						container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, unmountEventHandler);
						focusScopesStack.remove(focusScope);
					}, 0);
				});
			});
			function handleKeyDown(event) {
				if (!props.loop && !props.trapped) return;
				if (focusScope.paused) return;
				const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
				const focusedElement = getActiveElement();
				if (isTabKey && focusedElement) {
					const container = event.currentTarget;
					const [first, last] = getTabbableEdges(container);
					if (!(first && last)) {
						if (focusedElement === container) event.preventDefault();
					} else if (!event.shiftKey && focusedElement === last) {
						event.preventDefault();
						if (props.loop) focus(first, { select: true });
					} else if (event.shiftKey && focusedElement === first) {
						event.preventDefault();
						if (props.loop) focus(last, { select: true });
					}
				}
			}
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), {
					ref_key: "currentRef",
					ref: currentRef,
					tabindex: "-1",
					"as-child": _ctx.asChild,
					as: _ctx.as,
					onKeydown: handleKeyDown
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, ["as-child", "as"]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Menu/utils.js
	var SELECTION_KEYS = ["Enter", " "];
	var FIRST_KEYS = [
		"ArrowDown",
		"PageUp",
		"Home"
	];
	var LAST_KEYS = [
		"ArrowUp",
		"PageDown",
		"End"
	];
	[...FIRST_KEYS, ...LAST_KEYS];
	[...SELECTION_KEYS], [...SELECTION_KEYS];
	function getOpenState(open) {
		return open ? "open" : "closed";
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogContentImpl.js
	var DialogContentImpl_default = /* @__PURE__ */ defineComponent({
		__name: "DialogContentImpl",
		props: {
			forceMount: {
				type: Boolean,
				required: false
			},
			trapFocus: {
				type: Boolean,
				required: false
			},
			disableOutsidePointerEvents: {
				type: Boolean,
				required: false
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		emits: [
			"escapeKeyDown",
			"pointerDownOutside",
			"focusOutside",
			"interactOutside",
			"openAutoFocus",
			"closeAutoFocus"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emits = __emit;
			const rootContext = injectDialogRootContext();
			const { forwardRef, currentElement: contentElement } = useForwardExpose();
			rootContext.titleId ||= useId(void 0, "reka-dialog-title");
			rootContext.descriptionId ||= useId(void 0, "reka-dialog-description");
			onMounted(() => {
				rootContext.contentElement = contentElement;
				if (getActiveElement() !== document.body) rootContext.triggerElement.value = getActiveElement();
			});
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(FocusScope_default), {
					"as-child": "",
					loop: "",
					trapped: props.trapFocus,
					onMountAutoFocus: _cache[5] || (_cache[5] = ($event) => emits("openAutoFocus", $event)),
					onUnmountAutoFocus: _cache[6] || (_cache[6] = ($event) => emits("closeAutoFocus", $event))
				}, {
					default: withCtx(() => [createVNode(unref(DismissableLayer_default), mergeProps({
						id: unref(rootContext).contentId,
						ref: unref(forwardRef),
						as: _ctx.as,
						"as-child": _ctx.asChild,
						"disable-outside-pointer-events": _ctx.disableOutsidePointerEvents,
						role: "dialog",
						"aria-describedby": unref(rootContext).descriptionId,
						"aria-labelledby": unref(rootContext).titleId,
						"data-state": unref(getOpenState)(unref(rootContext).open.value)
					}, _ctx.$attrs, {
						onDismiss: _cache[0] || (_cache[0] = ($event) => unref(rootContext).onOpenChange(false)),
						onEscapeKeyDown: _cache[1] || (_cache[1] = ($event) => emits("escapeKeyDown", $event)),
						onFocusOutside: _cache[2] || (_cache[2] = ($event) => emits("focusOutside", $event)),
						onInteractOutside: _cache[3] || (_cache[3] = ($event) => emits("interactOutside", $event)),
						onPointerDownOutside: _cache[4] || (_cache[4] = ($event) => emits("pointerDownOutside", $event))
					}), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 16, [
						"id",
						"as",
						"as-child",
						"disable-outside-pointer-events",
						"aria-describedby",
						"aria-labelledby",
						"data-state"
					])]),
					_: 3
				}, 8, ["trapped"]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogContentModal.js
	var DialogContentModal_default = /* @__PURE__ */ defineComponent({
		__name: "DialogContentModal",
		props: {
			forceMount: {
				type: Boolean,
				required: false
			},
			trapFocus: {
				type: Boolean,
				required: false
			},
			disableOutsidePointerEvents: {
				type: Boolean,
				required: false
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		emits: [
			"escapeKeyDown",
			"pointerDownOutside",
			"focusOutside",
			"interactOutside",
			"openAutoFocus",
			"closeAutoFocus"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emits = __emit;
			const rootContext = injectDialogRootContext();
			const emitsAsProps = useEmitAsProps(emits);
			const { forwardRef, currentElement } = useForwardExpose();
			useHideOthers(currentElement);
			return (_ctx, _cache) => {
				return openBlock(), createBlock(DialogContentImpl_default, mergeProps({
					...props,
					...unref(emitsAsProps)
				}, {
					ref: unref(forwardRef),
					"trap-focus": unref(rootContext).open.value,
					"disable-outside-pointer-events": true,
					onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
						if (!event.defaultPrevented) {
							event.preventDefault();
							unref(rootContext).triggerElement.value?.focus();
						}
					}),
					onPointerDownOutside: _cache[1] || (_cache[1] = (event) => {
						const originalEvent = event.detail.originalEvent;
						const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
						if (originalEvent.button === 2 || ctrlLeftClick) event.preventDefault();
					}),
					onFocusOutside: _cache[2] || (_cache[2] = (event) => {
						event.preventDefault();
					})
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, ["trap-focus"]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogContentNonModal.js
	var DialogContentNonModal_default = /* @__PURE__ */ defineComponent({
		__name: "DialogContentNonModal",
		props: {
			forceMount: {
				type: Boolean,
				required: false
			},
			trapFocus: {
				type: Boolean,
				required: false
			},
			disableOutsidePointerEvents: {
				type: Boolean,
				required: false
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		emits: [
			"escapeKeyDown",
			"pointerDownOutside",
			"focusOutside",
			"interactOutside",
			"openAutoFocus",
			"closeAutoFocus"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emitsAsProps = useEmitAsProps(__emit);
			useForwardExpose();
			const rootContext = injectDialogRootContext();
			const hasInteractedOutsideRef = /* @__PURE__ */ ref(false);
			const hasPointerDownOutsideRef = /* @__PURE__ */ ref(false);
			return (_ctx, _cache) => {
				return openBlock(), createBlock(DialogContentImpl_default, mergeProps({
					...props,
					...unref(emitsAsProps)
				}, {
					"trap-focus": false,
					"disable-outside-pointer-events": false,
					onCloseAutoFocus: _cache[0] || (_cache[0] = (event) => {
						if (!event.defaultPrevented) {
							if (!hasInteractedOutsideRef.value) unref(rootContext).triggerElement.value?.focus();
							event.preventDefault();
						}
						hasInteractedOutsideRef.value = false;
						hasPointerDownOutsideRef.value = false;
					}),
					onInteractOutside: _cache[1] || (_cache[1] = (event) => {
						if (!event.defaultPrevented) {
							hasInteractedOutsideRef.value = true;
							if (event.detail.originalEvent.type === "pointerdown") hasPointerDownOutsideRef.value = true;
						}
						const target = event.target;
						if (unref(rootContext).triggerElement.value?.contains(target)) event.preventDefault();
						if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.value) event.preventDefault();
					})
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogContent.js
	var DialogContent_default = /* @__PURE__ */ defineComponent({
		__name: "DialogContent",
		props: {
			forceMount: {
				type: Boolean,
				required: false
			},
			disableOutsidePointerEvents: {
				type: Boolean,
				required: false
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		emits: [
			"escapeKeyDown",
			"pointerDownOutside",
			"focusOutside",
			"interactOutside",
			"openAutoFocus",
			"closeAutoFocus"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emits = __emit;
			const rootContext = injectDialogRootContext();
			const emitsAsProps = useEmitAsProps(emits);
			const { forwardRef } = useForwardExpose();
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(rootContext).open.value }, {
					default: withCtx(() => [unref(rootContext).modal.value ? (openBlock(), createBlock(DialogContentModal_default, mergeProps({
						key: 0,
						ref: unref(forwardRef)
					}, {
						...props,
						...unref(emitsAsProps),
						..._ctx.$attrs
					}), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 16)) : (openBlock(), createBlock(DialogContentNonModal_default, mergeProps({
						key: 1,
						ref: unref(forwardRef)
					}, {
						...props,
						...unref(emitsAsProps),
						..._ctx.$attrs
					}), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 16))]),
					_: 3
				}, 8, ["present"]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogDescription.js
	var DialogDescription_default = /* @__PURE__ */ defineComponent({
		__name: "DialogDescription",
		props: {
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false,
				default: "p"
			}
		},
		setup(__props) {
			const props = __props;
			useForwardExpose();
			const rootContext = injectDialogRootContext();
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(rootContext).descriptionId }), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, ["id"]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogOverlayImpl.js
	var DialogOverlayImpl_default = /* @__PURE__ */ defineComponent({
		__name: "DialogOverlayImpl",
		props: {
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		setup(__props) {
			const rootContext = injectDialogRootContext();
			useBodyScrollLock(true);
			useForwardExpose();
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), {
					as: _ctx.as,
					"as-child": _ctx.asChild,
					"data-state": unref(rootContext).open.value ? "open" : "closed",
					style: { "pointer-events": "auto" }
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"as",
					"as-child",
					"data-state"
				]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogOverlay.js
	var DialogOverlay_default = /* @__PURE__ */ defineComponent({
		__name: "DialogOverlay",
		props: {
			forceMount: {
				type: Boolean,
				required: false
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		setup(__props) {
			const rootContext = injectDialogRootContext();
			const { forwardRef } = useForwardExpose();
			return (_ctx, _cache) => {
				return unref(rootContext)?.modal.value ? (openBlock(), createBlock(unref(Presence_default), {
					key: 0,
					present: _ctx.forceMount || unref(rootContext).open.value
				}, {
					default: withCtx(() => [createVNode(DialogOverlayImpl_default, mergeProps(_ctx.$attrs, {
						ref: unref(forwardRef),
						as: _ctx.as,
						"as-child": _ctx.asChild
					}), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 16, ["as", "as-child"])]),
					_: 3
				}, 8, ["present"])) : createCommentVNode("v-if", true);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Teleport/Teleport.js
	var Teleport_default = /* @__PURE__ */ defineComponent({
		__name: "Teleport",
		props: {
			to: {
				type: null,
				required: false,
				default: "body"
			},
			disabled: {
				type: Boolean,
				required: false
			},
			defer: {
				type: Boolean,
				required: false
			},
			forceMount: {
				type: Boolean,
				required: false
			}
		},
		setup(__props) {
			const isMounted = useMounted();
			return (_ctx, _cache) => {
				return unref(isMounted) || _ctx.forceMount ? (openBlock(), createBlock(Teleport, {
					key: 0,
					to: _ctx.to,
					disabled: _ctx.disabled,
					defer: _ctx.defer
				}, [renderSlot(_ctx.$slots, "default")], 8, [
					"to",
					"disabled",
					"defer"
				])) : createCommentVNode("v-if", true);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogPortal.js
	var DialogPortal_default = /* @__PURE__ */ defineComponent({
		__name: "DialogPortal",
		props: {
			to: {
				type: null,
				required: false
			},
			disabled: {
				type: Boolean,
				required: false
			},
			defer: {
				type: Boolean,
				required: false
			},
			forceMount: {
				type: Boolean,
				required: false
			}
		},
		setup(__props) {
			const props = __props;
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Teleport_default), normalizeProps(guardReactiveProps(props)), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Dialog/DialogTitle.js
	var DialogTitle_default = /* @__PURE__ */ defineComponent({
		__name: "DialogTitle",
		props: {
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false,
				default: "h2"
			}
		},
		setup(__props) {
			const props = __props;
			const rootContext = injectDialogRootContext();
			useForwardExpose();
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), mergeProps(props, { id: unref(rootContext).titleId }), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, ["id"]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Collection/Collection.js
	var ITEM_DATA_ATTR = "data-reka-collection-item";
	function useCollection(options = {}) {
		const { key = "", isProvider = false } = options;
		const injectionKey = `${key}CollectionProvider`;
		let context;
		if (isProvider) {
			context = {
				collectionRef: /* @__PURE__ */ ref(),
				itemMap: /* @__PURE__ */ ref(/* @__PURE__ */ new Map())
			};
			provide(injectionKey, context);
		} else context = inject(injectionKey);
		const getItems = (includeDisabledItem = false) => {
			const collectionNode = context.collectionRef.value;
			if (!collectionNode) return [];
			const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
			const orderedItems = Array.from(context.itemMap.value.values()).sort((a, b) => orderedNodes.indexOf(a.ref) - orderedNodes.indexOf(b.ref));
			if (includeDisabledItem) return orderedItems;
			else return orderedItems.filter((i) => i.ref.dataset.disabled !== "");
		};
		const CollectionSlot = /* @__PURE__ */ defineComponent({
			name: "CollectionSlot",
			inheritAttrs: false,
			setup(_, { slots, attrs }) {
				const { primitiveElement, currentElement } = usePrimitiveElement();
				watch(currentElement, () => {
					context.collectionRef.value = currentElement.value;
				});
				return () => h(Slot, {
					ref: primitiveElement,
					...attrs
				}, slots);
			}
		});
		const CollectionItem = /* @__PURE__ */ defineComponent({
			name: "CollectionItem",
			inheritAttrs: false,
			props: { value: { validator: () => true } },
			setup(props, { slots, attrs }) {
				const { primitiveElement, currentElement } = usePrimitiveElement();
				watchEffect((cleanupFn) => {
					if (currentElement.value) {
						const key$1 = markRaw(currentElement.value);
						context.itemMap.value.set(key$1, {
							ref: currentElement.value,
							value: props.value
						});
						cleanupFn(() => context.itemMap.value.delete(key$1));
					}
				});
				return () => h(Slot, {
					...attrs,
					[ITEM_DATA_ATTR]: "",
					ref: primitiveElement
				}, slots);
			}
		});
		return {
			getItems,
			reactiveItems: computed(() => Array.from(context.itemMap.value.values())),
			itemMapSize: computed(() => context.itemMap.value.size),
			CollectionSlot,
			CollectionItem
		};
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/VisuallyHidden/VisuallyHidden.js
	var VisuallyHidden_default = /* @__PURE__ */ defineComponent({
		__name: "VisuallyHidden",
		props: {
			feature: {
				type: String,
				required: false,
				default: "focusable"
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false,
				default: "span"
			}
		},
		setup(__props) {
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), {
					as: _ctx.as,
					"as-child": _ctx.asChild,
					"aria-hidden": _ctx.feature === "focusable" ? "true" : void 0,
					"data-hidden": _ctx.feature === "fully-hidden" ? "" : void 0,
					tabindex: _ctx.feature === "fully-hidden" ? "-1" : void 0,
					style: {
						position: "absolute",
						border: 0,
						width: "1px",
						height: "1px",
						padding: 0,
						margin: "-1px",
						overflow: "hidden",
						clip: "rect(0, 0, 0, 0)",
						clipPath: "inset(50%)",
						whiteSpace: "nowrap",
						wordWrap: "normal",
						top: "-1px",
						left: "-1px"
					}
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"as",
					"as-child",
					"aria-hidden",
					"data-hidden",
					"tabindex"
				]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/ToastAnnounceExclude.js
	var ToastAnnounceExclude_default = /* @__PURE__ */ defineComponent({
		__name: "ToastAnnounceExclude",
		props: {
			altText: {
				type: String,
				required: false
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		setup(__props) {
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), {
					as: _ctx.as,
					"as-child": _ctx.asChild,
					"data-reka-toast-announce-exclude": "",
					"data-reka-toast-announce-alt": _ctx.altText || void 0
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 8, [
					"as",
					"as-child",
					"data-reka-toast-announce-alt"
				]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/ToastProvider.js
	var [injectToastProviderContext, provideToastProviderContext] = /* @__PURE__ */ createContext("ToastProvider");
	var ToastProvider_default = /* @__PURE__ */ defineComponent({
		inheritAttrs: false,
		__name: "ToastProvider",
		props: {
			label: {
				type: String,
				required: false,
				default: "Notification"
			},
			duration: {
				type: Number,
				required: false,
				default: 5e3
			},
			disableSwipe: {
				type: Boolean,
				required: false
			},
			swipeDirection: {
				type: String,
				required: false,
				default: "right"
			},
			swipeThreshold: {
				type: Number,
				required: false,
				default: 50
			}
		},
		setup(__props) {
			const props = __props;
			const { label, duration, disableSwipe, swipeDirection, swipeThreshold } = /* @__PURE__ */ toRefs(props);
			useCollection({ isProvider: true });
			const viewport = /* @__PURE__ */ ref();
			const toastCount = /* @__PURE__ */ ref(0);
			const isFocusedToastEscapeKeyDownRef = /* @__PURE__ */ ref(false);
			const isClosePausedRef = /* @__PURE__ */ ref(false);
			if (props.label && typeof props.label === "string" && !props.label.trim()) throw new Error("Invalid prop `label` supplied to `ToastProvider`. Expected non-empty `string`.");
			provideToastProviderContext({
				label,
				duration,
				disableSwipe,
				swipeDirection,
				swipeThreshold,
				toastCount,
				viewport,
				onViewportChange(el) {
					viewport.value = el;
				},
				onToastAdd() {
					toastCount.value++;
				},
				onToastRemove() {
					toastCount.value--;
				},
				isFocusedToastEscapeKeyDownRef,
				isClosePausedRef
			});
			return (_ctx, _cache) => {
				return renderSlot(_ctx.$slots, "default");
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/ToastAnnounce.js
	var ToastAnnounce_default = /* @__PURE__ */ defineComponent({
		__name: "ToastAnnounce",
		setup(__props) {
			const providerContext = injectToastProviderContext();
			const isAnnounced = useTimeout(1e3);
			const renderAnnounceText = /* @__PURE__ */ ref(false);
			useRafFn(() => {
				renderAnnounceText.value = true;
			});
			return (_ctx, _cache) => {
				return unref(isAnnounced) || renderAnnounceText.value ? (openBlock(), createBlock(unref(VisuallyHidden_default), {
					key: 0,
					feature: "fully-hidden"
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(unref(providerContext).label.value) + " ", 1), renderSlot(_ctx.$slots, "default")]),
					_: 3
				})) : createCommentVNode("v-if", true);
			};
		}
	});
	var VIEWPORT_PAUSE = "toast.viewportPause";
	var VIEWPORT_RESUME = "toast.viewportResume";
	function handleAndDispatchCustomEvent(name, handler, detail) {
		const currentTarget = detail.originalEvent.currentTarget;
		const event = new CustomEvent(name, {
			bubbles: false,
			cancelable: true,
			detail
		});
		if (handler) currentTarget.addEventListener(name, handler, { once: true });
		currentTarget.dispatchEvent(event);
	}
	function isDeltaInDirection(delta, direction, threshold = 0) {
		const deltaX = Math.abs(delta.x);
		const deltaY = Math.abs(delta.y);
		const isDeltaX = deltaX > deltaY;
		if (direction === "left" || direction === "right") return isDeltaX && deltaX > threshold;
		else return !isDeltaX && deltaY > threshold;
	}
	function isHTMLElement(node) {
		return node.nodeType === node.ELEMENT_NODE;
	}
	function getAnnounceTextContent(container) {
		const textContent = [];
		Array.from(container.childNodes).forEach((node) => {
			if (node.nodeType === node.TEXT_NODE && node.textContent) textContent.push(node.textContent);
			if (isHTMLElement(node)) {
				const isHidden = node.ariaHidden || node.hidden || node.style.display === "none";
				const isExcluded = node.dataset.rekaToastAnnounceExclude === "";
				if (!isHidden) if (isExcluded) {
					const altText = node.dataset.rekaToastAnnounceAlt;
					if (altText) textContent.push(altText);
				} else textContent.push(...getAnnounceTextContent(node));
			}
		});
		return textContent;
	}
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/ToastRootImpl.js
	var [injectToastRootContext, provideToastRootContext] = /* @__PURE__ */ createContext("ToastRoot");
	var ToastRootImpl_default = /* @__PURE__ */ defineComponent({
		inheritAttrs: false,
		__name: "ToastRootImpl",
		props: {
			type: {
				type: String,
				required: false
			},
			open: {
				type: Boolean,
				required: false,
				default: false
			},
			duration: {
				type: Number,
				required: false
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false,
				default: "li"
			}
		},
		emits: [
			"close",
			"escapeKeyDown",
			"pause",
			"resume",
			"swipeStart",
			"swipeMove",
			"swipeCancel",
			"swipeEnd"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emits = __emit;
			const { forwardRef, currentElement } = useForwardExpose();
			const { CollectionItem } = useCollection();
			const providerContext = injectToastProviderContext();
			const pointerStartRef = /* @__PURE__ */ ref(null);
			const swipeDeltaRef = /* @__PURE__ */ ref(null);
			const duration = computed(() => typeof props.duration === "number" ? props.duration : providerContext.duration.value);
			const closeTimerStartTimeRef = /* @__PURE__ */ ref(0);
			const closeTimerRemainingTimeRef = /* @__PURE__ */ ref(duration.value);
			const closeTimerRef = /* @__PURE__ */ ref(0);
			const remainingTime = /* @__PURE__ */ ref(duration.value);
			const remainingRaf = useRafFn(() => {
				const elapsedTime = Date.now() - closeTimerStartTimeRef.value;
				remainingTime.value = Math.max(closeTimerRemainingTimeRef.value - elapsedTime, 0);
			}, { fpsLimit: 60 });
			function startTimer(duration$1) {
				if (duration$1 <= 0 || duration$1 === Number.POSITIVE_INFINITY) return;
				if (!isClient) return;
				window.clearTimeout(closeTimerRef.value);
				closeTimerStartTimeRef.value = Date.now();
				closeTimerRef.value = window.setTimeout(handleClose, duration$1);
			}
			function handleClose(event) {
				const isNonPointerEvent = event?.pointerType === "";
				if (currentElement.value?.contains(getActiveElement()) && isNonPointerEvent) providerContext.viewport.value?.focus();
				if (isNonPointerEvent) providerContext.isClosePausedRef.value = false;
				emits("close");
			}
			const announceTextContent = computed(() => currentElement.value ? getAnnounceTextContent(currentElement.value) : null);
			if (props.type && !["foreground", "background"].includes(props.type)) throw new Error("Invalid prop `type` supplied to `Toast`. Expected `foreground | background`.");
			watchEffect((cleanupFn) => {
				const viewport = providerContext.viewport.value;
				if (viewport) {
					const handleResume = () => {
						startTimer(closeTimerRemainingTimeRef.value);
						remainingRaf.resume();
						emits("resume");
					};
					const handlePause = () => {
						const elapsedTime = Date.now() - closeTimerStartTimeRef.value;
						closeTimerRemainingTimeRef.value = closeTimerRemainingTimeRef.value - elapsedTime;
						window.clearTimeout(closeTimerRef.value);
						remainingRaf.pause();
						emits("pause");
					};
					viewport.addEventListener(VIEWPORT_PAUSE, handlePause);
					viewport.addEventListener(VIEWPORT_RESUME, handleResume);
					return () => {
						viewport.removeEventListener(VIEWPORT_PAUSE, handlePause);
						viewport.removeEventListener(VIEWPORT_RESUME, handleResume);
					};
				}
			});
			watch(() => [props.open, duration.value], () => {
				closeTimerRemainingTimeRef.value = duration.value;
				if (props.open && !providerContext.isClosePausedRef.value) startTimer(duration.value);
			}, { immediate: true });
			onKeyStroke("Escape", (event) => {
				emits("escapeKeyDown", event);
				if (!event.defaultPrevented) {
					providerContext.isFocusedToastEscapeKeyDownRef.value = true;
					handleClose();
				}
			});
			onMounted(() => {
				providerContext.onToastAdd();
			});
			onUnmounted(() => {
				providerContext.onToastRemove();
			});
			provideToastRootContext({ onClose: handleClose });
			return (_ctx, _cache) => {
				return openBlock(), createElementBlock(Fragment, null, [announceTextContent.value ? (openBlock(), createBlock(ToastAnnounce_default, {
					key: 0,
					role: "alert",
					"aria-live": _ctx.type === "foreground" ? "assertive" : "polite"
				}, {
					default: withCtx(() => [createTextVNode(toDisplayString(announceTextContent.value), 1)]),
					_: 1
				}, 8, ["aria-live"])) : createCommentVNode("v-if", true), unref(providerContext).viewport.value ? (openBlock(), createBlock(Teleport, {
					key: 1,
					to: unref(providerContext).viewport.value
				}, [createVNode(unref(CollectionItem), null, {
					default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
						ref: unref(forwardRef),
						tabindex: "0"
					}, _ctx.$attrs, {
						as: _ctx.as,
						"as-child": _ctx.asChild,
						"data-state": _ctx.open ? "open" : "closed",
						"data-swipe-direction": unref(providerContext).swipeDirection.value,
						style: unref(providerContext).disableSwipe.value ? void 0 : {
							userSelect: "none",
							touchAction: "none"
						},
						onPointerdown: _cache[0] || (_cache[0] = withModifiers((event) => {
							if (unref(providerContext).disableSwipe.value) return;
							pointerStartRef.value = {
								x: event.clientX,
								y: event.clientY
							};
						}, ["left"])),
						onPointermove: _cache[1] || (_cache[1] = (event) => {
							if (unref(providerContext).disableSwipe.value || !pointerStartRef.value) return;
							const x = event.clientX - pointerStartRef.value.x;
							const y = event.clientY - pointerStartRef.value.y;
							const hasSwipeMoveStarted = Boolean(swipeDeltaRef.value);
							const isHorizontalSwipe = ["left", "right"].includes(unref(providerContext).swipeDirection.value);
							const clamp = ["left", "up"].includes(unref(providerContext).swipeDirection.value) ? Math.min : Math.max;
							const clampedX = isHorizontalSwipe ? clamp(0, x) : 0;
							const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0;
							const moveStartBuffer = event.pointerType === "touch" ? 10 : 2;
							const delta = {
								x: clampedX,
								y: clampedY
							};
							const eventDetail = {
								originalEvent: event,
								delta
							};
							if (hasSwipeMoveStarted) {
								swipeDeltaRef.value = delta;
								unref(handleAndDispatchCustomEvent)(unref("toast.swipeMove"), (ev) => emits("swipeMove", ev), eventDetail);
							} else if (unref(isDeltaInDirection)(delta, unref(providerContext).swipeDirection.value, moveStartBuffer)) {
								swipeDeltaRef.value = delta;
								unref(handleAndDispatchCustomEvent)(unref("toast.swipeStart"), (ev) => emits("swipeStart", ev), eventDetail);
								event.target.setPointerCapture(event.pointerId);
							} else if (Math.abs(x) > moveStartBuffer || Math.abs(y) > moveStartBuffer) pointerStartRef.value = null;
						}),
						onPointerup: _cache[2] || (_cache[2] = (event) => {
							if (unref(providerContext).disableSwipe.value) return;
							const delta = swipeDeltaRef.value;
							const target = event.target;
							if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
							swipeDeltaRef.value = null;
							pointerStartRef.value = null;
							if (delta) {
								const toast = event.currentTarget;
								const eventDetail = {
									originalEvent: event,
									delta
								};
								if (unref(isDeltaInDirection)(delta, unref(providerContext).swipeDirection.value, unref(providerContext).swipeThreshold.value)) unref(handleAndDispatchCustomEvent)(unref("toast.swipeEnd"), (ev) => emits("swipeEnd", ev), eventDetail);
								else unref(handleAndDispatchCustomEvent)(unref("toast.swipeCancel"), (ev) => emits("swipeCancel", ev), eventDetail);
								toast?.addEventListener("click", (event$1) => event$1.preventDefault(), { once: true });
							}
						})
					}), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", {
							remaining: remainingTime.value,
							duration: duration.value
						})]),
						_: 3
					}, 16, [
						"as",
						"as-child",
						"data-state",
						"data-swipe-direction",
						"style"
					])]),
					_: 3
				})], 8, ["to"])) : createCommentVNode("v-if", true)], 64);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/ToastClose.js
	var ToastClose_default = /* @__PURE__ */ defineComponent({
		__name: "ToastClose",
		props: {
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false,
				default: "button"
			}
		},
		setup(__props) {
			const props = __props;
			const rootContext = injectToastRootContext();
			const { forwardRef } = useForwardExpose();
			return (_ctx, _cache) => {
				return openBlock(), createBlock(ToastAnnounceExclude_default, { "as-child": "" }, {
					default: withCtx(() => [createVNode(unref(Primitive), mergeProps(props, {
						ref: unref(forwardRef),
						type: _ctx.as === "button" ? "button" : void 0,
						onClick: unref(rootContext).onClose
					}), {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 16, ["type", "onClick"])]),
					_: 3
				});
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/ToastAction.js
	var ToastAction_default = /* @__PURE__ */ defineComponent({
		__name: "ToastAction",
		props: {
			altText: {
				type: String,
				required: true
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		setup(__props) {
			if (!__props.altText) throw new Error("Missing prop `altText` expected on `ToastAction`");
			const { forwardRef } = useForwardExpose();
			return (_ctx, _cache) => {
				return _ctx.altText ? (openBlock(), createBlock(ToastAnnounceExclude_default, {
					key: 0,
					"alt-text": _ctx.altText,
					"as-child": ""
				}, {
					default: withCtx(() => [createVNode(ToastClose_default, {
						ref: unref(forwardRef),
						as: _ctx.as,
						"as-child": _ctx.asChild
					}, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
						_: 3
					}, 8, ["as", "as-child"])]),
					_: 3
				}, 8, ["alt-text"])) : createCommentVNode("v-if", true);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/ToastDescription.js
	var ToastDescription_default = /* @__PURE__ */ defineComponent({
		__name: "ToastDescription",
		props: {
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		setup(__props) {
			const props = __props;
			useForwardExpose();
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/ToastRoot.js
	var ToastRoot_default = /* @__PURE__ */ defineComponent({
		__name: "ToastRoot",
		props: {
			defaultOpen: {
				type: Boolean,
				required: false,
				default: true
			},
			forceMount: {
				type: Boolean,
				required: false
			},
			type: {
				type: String,
				required: false,
				default: "foreground"
			},
			open: {
				type: Boolean,
				required: false,
				default: void 0
			},
			duration: {
				type: Number,
				required: false
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false,
				default: "li"
			}
		},
		emits: [
			"escapeKeyDown",
			"pause",
			"resume",
			"swipeStart",
			"swipeMove",
			"swipeCancel",
			"swipeEnd",
			"update:open"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emits = __emit;
			const { forwardRef } = useForwardExpose();
			const open = useVModel(props, "open", emits, {
				defaultValue: props.defaultOpen,
				passive: props.open === void 0
			});
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Presence_default), { present: _ctx.forceMount || unref(open) }, {
					default: withCtx(() => [createVNode(ToastRootImpl_default, mergeProps({
						ref: unref(forwardRef),
						open: unref(open),
						type: _ctx.type,
						as: _ctx.as,
						"as-child": _ctx.asChild,
						duration: _ctx.duration
					}, _ctx.$attrs, {
						onClose: _cache[0] || (_cache[0] = ($event) => open.value = false),
						onPause: _cache[1] || (_cache[1] = ($event) => emits("pause")),
						onResume: _cache[2] || (_cache[2] = ($event) => emits("resume")),
						onEscapeKeyDown: _cache[3] || (_cache[3] = ($event) => emits("escapeKeyDown", $event)),
						onSwipeStart: _cache[4] || (_cache[4] = (event) => {
							emits("swipeStart", event);
							if (!event.defaultPrevented) event.currentTarget.setAttribute("data-swipe", "start");
						}),
						onSwipeMove: _cache[5] || (_cache[5] = (event) => {
							emits("swipeMove", event);
							if (!event.defaultPrevented) {
								const { x, y } = event.detail.delta;
								const target = event.currentTarget;
								target.setAttribute("data-swipe", "move");
								target.style.setProperty("--reka-toast-swipe-move-x", `${x}px`);
								target.style.setProperty("--reka-toast-swipe-move-y", `${y}px`);
							}
						}),
						onSwipeCancel: _cache[6] || (_cache[6] = (event) => {
							emits("swipeCancel", event);
							if (!event.defaultPrevented) {
								const target = event.currentTarget;
								target.setAttribute("data-swipe", "cancel");
								target.style.removeProperty("--reka-toast-swipe-move-x");
								target.style.removeProperty("--reka-toast-swipe-move-y");
								target.style.removeProperty("--reka-toast-swipe-end-x");
								target.style.removeProperty("--reka-toast-swipe-end-y");
							}
						}),
						onSwipeEnd: _cache[7] || (_cache[7] = (event) => {
							emits("swipeEnd", event);
							if (!event.defaultPrevented) {
								const { x, y } = event.detail.delta;
								const target = event.currentTarget;
								target.setAttribute("data-swipe", "end");
								target.style.removeProperty("--reka-toast-swipe-move-x");
								target.style.removeProperty("--reka-toast-swipe-move-y");
								target.style.setProperty("--reka-toast-swipe-end-x", `${x}px`);
								target.style.setProperty("--reka-toast-swipe-end-y", `${y}px`);
								open.value = false;
							}
						})
					}), {
						default: withCtx(({ remaining, duration: _duration }) => [renderSlot(_ctx.$slots, "default", {
							remaining,
							duration: _duration,
							open: unref(open)
						})]),
						_: 3
					}, 16, [
						"open",
						"type",
						"as",
						"as-child",
						"duration"
					])]),
					_: 3
				}, 8, ["present"]);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/ToastTitle.js
	var ToastTitle_default = /* @__PURE__ */ defineComponent({
		__name: "ToastTitle",
		props: {
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false
			}
		},
		setup(__props) {
			const props = __props;
			useForwardExpose();
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(Primitive), normalizeProps(guardReactiveProps(props)), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16);
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/FocusProxy.js
	var FocusProxy_default = /* @__PURE__ */ defineComponent({
		__name: "FocusProxy",
		emits: ["focusFromOutsideViewport"],
		setup(__props, { emit: __emit }) {
			const emits = __emit;
			const providerContext = injectToastProviderContext();
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(VisuallyHidden_default), {
					tabindex: "0",
					style: { "position": "fixed" },
					onFocus: _cache[0] || (_cache[0] = (event) => {
						const prevFocusedElement = event.relatedTarget;
						if (!unref(providerContext).viewport.value?.contains(prevFocusedElement)) emits("focusFromOutsideViewport");
					})
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				});
			};
		}
	});
	//#endregion
	//#region node_modules/.pnpm/reka-ui@2.9.5_vue@3.5.32_typescript@6.0.2_/node_modules/reka-ui/dist/Toast/ToastViewport.js
	var ToastViewport_default = /* @__PURE__ */ defineComponent({
		inheritAttrs: false,
		__name: "ToastViewport",
		props: {
			hotkey: {
				type: Array,
				required: false,
				default: () => ["F8"]
			},
			label: {
				type: [String, Function],
				required: false,
				default: "Notifications ({hotkey})"
			},
			asChild: {
				type: Boolean,
				required: false
			},
			as: {
				type: null,
				required: false,
				default: "ol"
			}
		},
		setup(__props) {
			const { hotkey, label } = /* @__PURE__ */ toRefs(__props);
			const { forwardRef, currentElement } = useForwardExpose();
			const { CollectionSlot, getItems } = useCollection();
			const providerContext = injectToastProviderContext();
			const hasToasts = computed(() => providerContext.toastCount.value > 0);
			const headFocusProxyRef = /* @__PURE__ */ ref();
			const tailFocusProxyRef = /* @__PURE__ */ ref();
			const KEY_RE = /Key/g;
			const DIGIT_RE = /Digit/g;
			const hotkeyMessage = computed(() => hotkey.value.join("+").replace(KEY_RE, "").replace(DIGIT_RE, ""));
			onKeyStroke(hotkey.value, () => {
				currentElement.value.focus();
			});
			onMounted(() => {
				providerContext.onViewportChange(currentElement.value);
			});
			watchEffect((cleanupFn) => {
				const viewport = currentElement.value;
				if (hasToasts.value && viewport) {
					const handlePause = () => {
						if (!providerContext.isClosePausedRef.value) {
							const pauseEvent = new CustomEvent(VIEWPORT_PAUSE);
							viewport.dispatchEvent(pauseEvent);
							providerContext.isClosePausedRef.value = true;
						}
					};
					const handleResume = () => {
						if (providerContext.isClosePausedRef.value) {
							const resumeEvent = new CustomEvent(VIEWPORT_RESUME);
							viewport.dispatchEvent(resumeEvent);
							providerContext.isClosePausedRef.value = false;
						}
					};
					const handleFocusOutResume = (event) => {
						if (!viewport.contains(event.relatedTarget)) handleResume();
					};
					const handlePointerLeaveResume = () => {
						if (!viewport.contains(getActiveElement())) handleResume();
					};
					const handleKeyDown = (event) => {
						const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
						if (event.key === "Tab" && !isMetaKey) {
							const focusedElement = getActiveElement();
							const isTabbingBackwards = event.shiftKey;
							if (event.target === viewport && isTabbingBackwards) {
								headFocusProxyRef.value?.focus();
								return;
							}
							const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection: isTabbingBackwards ? "backwards" : "forwards" });
							const index = sortedCandidates.findIndex((candidate) => candidate === focusedElement);
							if (focusFirst(sortedCandidates.slice(index + 1))) event.preventDefault();
							else isTabbingBackwards ? headFocusProxyRef.value?.focus() : tailFocusProxyRef.value?.focus();
						}
					};
					viewport.addEventListener("focusin", handlePause);
					viewport.addEventListener("focusout", handleFocusOutResume);
					viewport.addEventListener("pointermove", handlePause);
					viewport.addEventListener("pointerleave", handlePointerLeaveResume);
					viewport.addEventListener("keydown", handleKeyDown);
					window.addEventListener("blur", handlePause);
					window.addEventListener("focus", handleResume);
					cleanupFn(() => {
						viewport.removeEventListener("focusin", handlePause);
						viewport.removeEventListener("focusout", handleFocusOutResume);
						viewport.removeEventListener("pointermove", handlePause);
						viewport.removeEventListener("pointerleave", handlePointerLeaveResume);
						viewport.removeEventListener("keydown", handleKeyDown);
						window.removeEventListener("blur", handlePause);
						window.removeEventListener("focus", handleResume);
					});
				}
			});
			function getSortedTabbableCandidates({ tabbingDirection }) {
				const tabbableCandidates = getItems().map((i) => i.ref).map((toastNode) => {
					const toastTabbableCandidates = [toastNode, ...getTabbableCandidates(toastNode)];
					return tabbingDirection === "forwards" ? toastTabbableCandidates : toastTabbableCandidates.reverse();
				});
				return (tabbingDirection === "forwards" ? tabbableCandidates.reverse() : tabbableCandidates).flat();
			}
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(DismissableLayerBranch_default), {
					role: "region",
					"aria-label": typeof unref(label) === "string" ? unref(label).replace("{hotkey}", hotkeyMessage.value) : unref(label)(hotkeyMessage.value),
					tabindex: "-1",
					style: normalizeStyle({ pointerEvents: hasToasts.value ? void 0 : "none" })
				}, {
					default: withCtx(() => [
						hasToasts.value ? (openBlock(), createBlock(FocusProxy_default, {
							key: 0,
							ref: (node) => {
								if (!node) return void 0;
								headFocusProxyRef.value = unref(unrefElement)(node);
							},
							onFocusFromOutsideViewport: _cache[0] || (_cache[0] = () => {
								const tabbableCandidates = getSortedTabbableCandidates({ tabbingDirection: "forwards" });
								unref(focusFirst)(tabbableCandidates);
							})
						}, null, 512)) : createCommentVNode("v-if", true),
						createVNode(unref(CollectionSlot), null, {
							default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
								ref: unref(forwardRef),
								tabindex: "-1",
								as: _ctx.as,
								"as-child": _ctx.asChild
							}, _ctx.$attrs), {
								default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
								_: 3
							}, 16, ["as", "as-child"])]),
							_: 3
						}),
						hasToasts.value ? (openBlock(), createBlock(FocusProxy_default, {
							key: 1,
							ref: (node) => {
								if (!node) return void 0;
								tailFocusProxyRef.value = unref(unrefElement)(node);
							},
							onFocusFromOutsideViewport: _cache[1] || (_cache[1] = () => {
								const tabbableCandidates = getSortedTabbableCandidates({ tabbingDirection: "backwards" });
								unref(focusFirst)(tabbableCandidates);
							})
						}, null, 512)) : createCommentVNode("v-if", true)
					]),
					_: 3
				}, 8, ["aria-label", "style"]);
			};
		}
	});
	//#endregion
	//#region src/components/AssetLightbox.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$10 = {
		key: 0,
		class: "relative flex w-full flex-col items-center"
	};
	var _hoisted_2$8 = { class: "flex h-[min(62vh,520px)] w-full max-w-[calc(100vw-2rem)] items-center justify-center bg-white p-3 shadow-2xl sm:h-[min(78vh,900px)] sm:w-[960px] sm:max-w-[calc(100vw-8rem)] sm:p-6" };
	var _hoisted_3$7 = ["src", "alt"];
	var _hoisted_4$6 = { class: "mt-4 max-w-[calc(100vw-2rem)] text-center text-base font-medium text-white sm:max-w-[calc(100vw-8rem)] sm:text-lg" };
	//#endregion
	//#region src/components/AssetLightbox.vue
	var AssetLightbox_default = /* @__PURE__ */ defineComponent({
		__name: "AssetLightbox",
		props: {
			open: { type: Boolean },
			initialAssetId: {},
			assets: {},
			primarySiteId: {}
		},
		emits: ["update:open"],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emit = __emit;
			const currentIndex = /* @__PURE__ */ ref(0);
			watch(() => props.open, (isOpen) => {
				if (isOpen && props.initialAssetId !== null) {
					const index = props.assets.findIndex((a) => a[props.primarySiteId]?.id === props.initialAssetId);
					if (index !== -1) currentIndex.value = index;
				}
			});
			const currentAssetWrapper = computed(() => props.assets[currentIndex.value]);
			const currentAsset = computed(() => {
				if (!currentAssetWrapper.value) return null;
				return currentAssetWrapper.value[props.primarySiteId];
			});
			function next() {
				if (currentIndex.value < props.assets.length - 1) currentIndex.value++;
				else currentIndex.value = 0;
			}
			function prev() {
				if (currentIndex.value > 0) currentIndex.value--;
				else currentIndex.value = props.assets.length - 1;
			}
			function onKeydown(e) {
				if (!props.open) return;
				if (e.key === "ArrowRight") next();
				if (e.key === "ArrowLeft") prev();
			}
			onMounted(() => {
				window.addEventListener("keydown", onKeydown);
			});
			onUnmounted(() => {
				window.removeEventListener("keydown", onKeydown);
			});
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(DialogRoot_default), {
					open: __props.open,
					"onUpdate:open": _cache[0] || (_cache[0] = ($event) => emit("update:open", $event))
				}, {
					default: withCtx(() => [createVNode(unref(DialogPortal_default), null, {
						default: withCtx(() => [createVNode(unref(DialogOverlay_default), { class: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity" }), createVNode(unref(DialogContent_default), { class: "fixed top-1/2 left-1/2 z-50 flex w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center px-3 py-4 shadow-none outline-none sm:p-4" }, {
							default: withCtx(() => [
								createVNode(unref(DialogTitle_default), { class: "sr-only" }, {
									default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode(" Asset Preview ", -1)])]),
									_: 1
								}),
								createVNode(unref(DialogDescription_default), { class: "sr-only" }, {
									default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" Preview of the selected asset ", -1)])]),
									_: 1
								}),
								currentAsset.value ? (openBlock(), createElementBlock("div", _hoisted_1$10, [
									createVNode(unref(DialogClose_default), { class: "absolute -top-[0.75rem] right-4 cursor-pointer p-2 text-white mix-blend-difference hover:text-gray-300 focus:outline-none max-md:hidden xl:right-14" }, {
										default: withCtx(() => [..._cache[3] || (_cache[3] = [createBaseVNode("svg", {
											xmlns: "http://www.w3.org/2000/svg",
											width: "24",
											height: "24",
											viewBox: "0 0 24 24",
											fill: "none",
											stroke: "currentColor",
											"stroke-width": "2",
											"stroke-linecap": "round",
											"stroke-linejoin": "round"
										}, [createBaseVNode("path", { d: "M18 6 6 18" }), createBaseVNode("path", { d: "M6 6 18 18" })], -1)])]),
										_: 1
									}),
									createBaseVNode("div", _hoisted_2$8, [createBaseVNode("img", {
										src: currentAsset.value.url,
										alt: currentAsset.value.title || "Asset",
										class: "h-full w-full object-contain"
									}, null, 8, _hoisted_3$7)]),
									createBaseVNode("div", _hoisted_4$6, toDisplayString(currentAsset.value.title), 1),
									createBaseVNode("button", {
										class: "absolute top-1/2 left-1 -translate-y-1/2 cursor-pointer p-2 text-white mix-blend-difference hover:text-gray-300 focus:outline-none sm:left-[max(2vw,0.5rem)]",
										onClick: prev,
										title: "Previous"
									}, [..._cache[4] || (_cache[4] = [createBaseVNode("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "28",
										height: "28",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										"stroke-width": "2",
										"stroke-linecap": "round",
										"stroke-linejoin": "round"
									}, [createBaseVNode("path", { d: "m15 18-6-6 6-6" })], -1)])]),
									createBaseVNode("button", {
										class: "absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer p-2 text-white mix-blend-difference hover:text-gray-300 focus:outline-none sm:right-[max(2vw,0.5rem)]",
										onClick: next,
										title: "Next"
									}, [..._cache[5] || (_cache[5] = [createBaseVNode("svg", {
										xmlns: "http://www.w3.org/2000/svg",
										width: "28",
										height: "28",
										viewBox: "0 0 24 24",
										fill: "none",
										stroke: "currentColor",
										"stroke-width": "2",
										"stroke-linecap": "round",
										"stroke-linejoin": "round"
									}, [createBaseVNode("path", { d: "m9 18 6-6-6-6" })], -1)])])
								])) : createCommentVNode("", true)
							]),
							_: 1
						})]),
						_: 1
					})]),
					_: 1
				}, 8, ["open"]);
			};
		}
	});
	//#endregion
	//#region src/components/AssetCardSkeleton.vue
	var _sfc_main$1 = {};
	var _hoisted_1$9 = { class: "relative flex h-full flex-col items-start gap-0 overflow-hidden rounded-[1.25rem] border border-[#ECECEC] bg-white" };
	var _hoisted_2$7 = { class: "flex w-full flex-col pt-2" };
	function _sfc_render$1(_ctx, _cache) {
		return openBlock(), createElementBlock("div", _hoisted_1$9, [_cache[1] || (_cache[1] = createBaseVNode("div", { class: "relative h-32 w-full" }, [createBaseVNode("div", { class: "skeleton-shimmer h-full w-full bg-gray-200" })], -1)), createBaseVNode("div", _hoisted_2$7, [(openBlock(), createElementBlock(Fragment, null, renderList(2, (i) => {
			return createBaseVNode("div", {
				key: `site-skeleton-${i}`,
				class: "mb-4 flex w-full border-b border-[#ECECEC] last:mb-0 last:border-b-0"
			}, [..._cache[0] || (_cache[0] = [createStaticVNode("<div class=\"relative flex w-full items-center px-3\" data-v-7baa44f7><div class=\"skeleton-shimmer h-4 w-24 rounded bg-gray-200\" data-v-7baa44f7></div><div class=\"skeleton-shimmer absolute left-1/2 h-4 w-10 -translate-x-1/2 rounded bg-gray-200\" data-v-7baa44f7></div><div class=\"skeleton-shimmer mb-1 ml-auto h-7 w-7 rounded-full border border-gray-300 bg-gray-100\" data-v-7baa44f7></div></div><div class=\"w-full px-3 py-1\" data-v-7baa44f7><div class=\"skeleton-shimmer h-20 w-full rounded-lg border border-gray-200 bg-gray-100\" data-v-7baa44f7></div></div>", 2)])]);
		}), 64))])]);
	}
	var AssetCardSkeleton_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-7baa44f7"]]);
	//#endregion
	//#region src/components/AssetPagination.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$8 = {
		key: 0,
		class: "mt-6 flex items-center justify-center gap-4"
	};
	var _hoisted_2$6 = ["disabled"];
	var _hoisted_3$6 = { class: "flex items-center gap-2" };
	var _hoisted_4$5 = ["max"];
	var _hoisted_5$3 = { class: "text-sm text-ap-dark-green" };
	var _hoisted_6$3 = ["disabled"];
	//#endregion
	//#region src/components/AssetPagination.vue
	var AssetPagination_default = /* @__PURE__ */ defineComponent({
		__name: "AssetPagination",
		props: { pagination: {} },
		emits: [
			"previous",
			"next",
			"page-change"
		],
		setup(__props, { emit: __emit }) {
			const props = __props;
			const emit = __emit;
			const currentPage = computed(() => {
				if (!props.pagination) return 1;
				return Math.floor(props.pagination.offset / props.pagination.limit) + 1;
			});
			const pageInput = /* @__PURE__ */ ref(1);
			watch(currentPage, (val) => {
				pageInput.value = val;
			}, { immediate: true });
			const totalPages = computed(() => {
				if (!props.pagination) return 1;
				return Math.ceil(props.pagination.total / props.pagination.limit);
			});
			const canGoPrevious = computed(() => {
				return props.pagination !== null && props.pagination.offset > 0;
			});
			const canGoNext = computed(() => {
				return props.pagination !== null && props.pagination.hasMore;
			});
			const handlePrevious = () => {
				if (!props.pagination || !canGoPrevious.value) return;
				emit("previous");
			};
			const handleNext = () => {
				if (!props.pagination || !canGoNext.value) return;
				emit("next");
			};
			const handleInput = () => {
				if (!props.pagination) return;
				let page = pageInput.value;
				if (page < 1) page = 1;
				if (page > totalPages.value) page = totalPages.value;
				pageInput.value = page;
				if (page !== currentPage.value) emit("page-change", page);
			};
			return (_ctx, _cache) => {
				return __props.pagination ? (openBlock(), createElementBlock("div", _hoisted_1$8, [
					createBaseVNode("button", {
						onClick: handlePrevious,
						disabled: !canGoPrevious.value,
						class: "disabled:cursor-not-allowed disabled:opacity-50"
					}, [..._cache[1] || (_cache[1] = [createBaseVNode("svg", {
						width: "30",
						height: "30",
						viewBox: "0 0 30 30",
						fill: "none",
						xmlns: "http://www.w3.org/2000/svg"
					}, [createBaseVNode("circle", {
						cx: "15",
						cy: "15",
						r: "14.5",
						transform: "matrix(-1 0 0 1 30 0)",
						stroke: "#3C6E4E"
					}), createBaseVNode("path", {
						d: "M7.29289 15.7071C6.90237 15.3166 6.90237 14.6834 7.29289 14.2929L13.6569 7.92893C14.0474 7.53841 14.6805 7.53841 15.0711 7.92893C15.4616 8.31946 15.4616 8.95262 15.0711 9.34315L9.41421 15L15.0711 20.6569C15.4616 21.0474 15.4616 21.6805 15.0711 22.0711C14.6805 22.4616 14.0474 22.4616 13.6569 22.0711L7.29289 15.7071ZM23 15V16L8 16V15V14L23 14V15Z",
						fill: "#3C6E4E"
					})], -1)])], 8, _hoisted_2$6),
					createBaseVNode("div", _hoisted_3$6, [withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => pageInput.value = $event),
						onChange: handleInput,
						onKeyup: withKeys(handleInput, ["enter"]),
						type: "number",
						min: "1",
						max: totalPages.value,
						class: "w-16 rounded border border-ap-dark-green px-2 py-1 text-center text-ap-dark-green"
					}, null, 40, _hoisted_4$5), [[
						vModelText,
						pageInput.value,
						void 0,
						{ number: true }
					]]), createBaseVNode("span", _hoisted_5$3, " / " + toDisplayString(totalPages.value), 1)]),
					createBaseVNode("button", {
						onClick: handleNext,
						disabled: !canGoNext.value,
						class: "disabled:cursor-not-allowed disabled:opacity-50"
					}, [..._cache[2] || (_cache[2] = [createBaseVNode("svg", {
						width: "30",
						height: "30",
						viewBox: "0 0 30 30",
						fill: "none",
						xmlns: "http://www.w3.org/2000/svg"
					}, [createBaseVNode("circle", {
						cx: "15",
						cy: "15",
						r: "14.5",
						stroke: "#3C6E4E"
					}), createBaseVNode("path", {
						d: "M22.7071 15.7071C23.0976 15.3166 23.0976 14.6834 22.7071 14.2929L16.3431 7.92893C15.9526 7.53841 15.3195 7.53841 14.9289 7.92893C14.5384 8.31946 14.5384 8.95262 14.9289 9.34315L20.5858 15L14.9289 20.6569C14.5384 21.0474 14.5384 21.6805 14.9289 22.0711C15.3195 22.4616 15.9526 22.4616 16.3431 22.0711L22.7071 15.7071ZM7 15V16L22 16V15V14L7 14V15Z",
						fill: "#3C6E4E"
					})], -1)])], 8, _hoisted_6$3)
				])) : createCommentVNode("", true);
			};
		}
	});
	//#endregion
	//#region src/components/AltPilotSearch.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$7 = { class: "relative" };
	//#endregion
	//#region src/components/AltPilotSearch.vue
	var AltPilotSearch_default = /* @__PURE__ */ defineComponent({
		__name: "AltPilotSearch",
		setup(__props) {
			const { fetchAssets, query } = useAssets();
			const searchQuery = /* @__PURE__ */ ref(query.value || "");
			const debouncedSearch = useDebounceFn((val) => {
				query.value = val;
				fetchAssets({ offset: 0 });
			}, 400);
			watch(searchQuery, (newVal) => {
				debouncedSearch(newVal);
			});
			watch(() => query.value, (newVal) => {
				if (newVal !== searchQuery.value) searchQuery.value = newVal;
			});
			const clearSearch = () => {
				searchQuery.value = "";
			};
			return (_ctx, _cache) => {
				return openBlock(), createElementBlock("div", _hoisted_1$7, [
					withDirectives(createBaseVNode("input", {
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchQuery.value = $event),
						type: "text",
						class: "block h-12 w-full rounded-full border border-ap-dark-green pr-12 pl-12 text-xl text-ap-dark-green transition-colors focus:bg-ap-light-green/30 focus:ring-0 focus:ring-ap-dark-green focus:outline-none"
					}, null, 512), [[vModelText, searchQuery.value]]),
					_cache[2] || (_cache[2] = createBaseVNode("div", { class: "pointer-events-none absolute inset-y-0 left-3 flex items-center" }, [createBaseVNode("svg", {
						class: "h-6 w-6 text-ap-dark-green",
						"aria-hidden": "true",
						xmlns: "http://www.w3.org/2000/svg",
						fill: "none",
						viewBox: "0 0 20 20"
					}, [createBaseVNode("path", {
						stroke: "currentColor",
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
					})])], -1)),
					searchQuery.value ? (openBlock(), createElementBlock("button", {
						key: 0,
						onClick: clearSearch,
						type: "button",
						class: "absolute inset-y-0 right-3 flex items-center p-1 text-ap-dark-green hover:text-ap-dark-green/80",
						"aria-label": "Clear search"
					}, [..._cache[1] || (_cache[1] = [createBaseVNode("svg", {
						class: "h-4 w-4",
						"aria-hidden": "true",
						xmlns: "http://www.w3.org/2000/svg",
						fill: "none",
						viewBox: "0 0 14 14"
					}, [createBaseVNode("path", {
						stroke: "currentColor",
						"stroke-linecap": "round",
						"stroke-linejoin": "round",
						"stroke-width": "2",
						d: "m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
					})], -1)])])) : createCommentVNode("", true)
				]);
			};
		}
	});
	//#endregion
	//#region src/components/AltPilotLogo.vue
	var _sfc_main = {};
	var _hoisted_1$6 = {
		width: "144",
		height: "144",
		viewBox: "0 0 144 144",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg"
	};
	function _sfc_render(_ctx, _cache) {
		return openBlock(), createElementBlock("svg", _hoisted_1$6, [..._cache[0] || (_cache[0] = [createBaseVNode("path", {
			d: "M0 15C0 6.71573 6.71573 0 15 0H129C137.284 0 144 6.71573 144 15V129C144 137.284 137.284 144 129 144H15C6.71573 144 0 137.284 0 129V15Z",
			fill: "#8FF5B3"
		}, null, -1), createBaseVNode("path", {
			d: "M25 17.5H39.7686C42.0149 17.5 44.1428 18.5073 45.5674 20.2441L122.664 114.244C126.679 119.14 123.196 126.5 116.865 126.5H25C20.8579 126.5 17.5 123.142 17.5 119V25C17.5 20.8579 20.8579 17.5 25 17.5Z",
			fill: "#3C6E4E",
			stroke: "#3C6E4E",
			"stroke-width": "5"
		}, null, -1)])]);
	}
	var AltPilotLogo_default = /* @__PURE__ */ _plugin_vue_export_helper_default(_sfc_main, [["render", _sfc_render]]);
	//#endregion
	//#region src/components/AltPilotHeaderTotal.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$5 = { class: "flex items-center gap-5 text-ap-dark-green" };
	var _hoisted_2$5 = { class: "pointer-events-none mb-2 flex h-14 w-14 shrink-0 items-center justify-center self-end rounded-2xl pt-1 text-ap-dark-green" };
	var _hoisted_3$5 = { class: "m-0 mt-1 text-[3.75rem] leading-[1]" };
	//#endregion
	//#region src/components/AltPilotHeaderTotal.vue
	var AltPilotHeaderTotal_default = /* @__PURE__ */ defineComponent({
		__name: "AltPilotHeaderTotal",
		setup(__props) {
			const { total } = useStatusCounts();
			const formatNumber = (num) => {
				return num.toLocaleString("de-DE");
			};
			return (_ctx, _cache) => {
				return openBlock(), createElementBlock("div", _hoisted_1$5, [createBaseVNode("div", _hoisted_2$5, [createVNode(AltPilotLogo_default, { class: "max-h-12 w-12" })]), createBaseVNode("div", null, [createBaseVNode("p", _hoisted_3$5, toDisplayString(formatNumber(unref(total))), 1)])]);
			};
		}
	});
	//#endregion
	//#region src/components/AltPilotHeaderStats.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$4 = { class: "text-ap-dark-green" };
	var _hoisted_2$4 = { class: "grid grid-cols-[max-content_max-content] gap-x-3 gap-y-0.5 pt-1 text-sm leading-[1.15]" };
	var _hoisted_3$4 = { class: "m-0" };
	var _hoisted_4$4 = { class: "m-0" };
	var _hoisted_5$2 = { class: "m-0" };
	var _hoisted_6$2 = { class: "m-0" };
	var _hoisted_7$1 = { class: "m-0" };
	var _hoisted_8$1 = { class: "m-0" };
	//#endregion
	//#region src/components/AltPilotHeaderStats.vue
	var AltPilotHeaderStats_default = /* @__PURE__ */ defineComponent({
		__name: "AltPilotHeaderStats",
		setup(__props) {
			const { missingCount, aiGeneratedCount, manualCount, fetchStatusCounts } = useStatusCounts();
			useIntervalFn(() => {
				fetchStatusCounts();
			}, 6e4);
			const formatNumber = (num) => num.toLocaleString("de-DE");
			return (_ctx, _cache) => {
				return openBlock(), createElementBlock("div", _hoisted_1$4, [createBaseVNode("div", _hoisted_2$4, [
					createBaseVNode("p", _hoisted_3$4, toDisplayString(unref(assetStatus)[1]), 1),
					createBaseVNode("p", _hoisted_4$4, toDisplayString(formatNumber(unref(aiGeneratedCount))), 1),
					createBaseVNode("p", _hoisted_5$2, toDisplayString(unref(assetStatus)[2]), 1),
					createBaseVNode("p", _hoisted_6$2, toDisplayString(formatNumber(unref(manualCount))), 1),
					createBaseVNode("p", _hoisted_7$1, toDisplayString(unref(assetStatus)[0]), 1),
					createBaseVNode("p", _hoisted_8$1, toDisplayString(formatNumber(unref(missingCount))), 1)
				])]);
			};
		}
	});
	//#endregion
	//#region src/components/AltPilotFilter.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$3 = { class: "my-4" };
	var _hoisted_2$3 = { class: "grid grid-cols-[1fr_max-content] items-end gap-4 max-md:grid-cols-1" };
	var _hoisted_3$3 = { class: "text-xl text-ap-dark-green" };
	var _hoisted_4$3 = { class: "flex md:justify-self-end" };
	var _hoisted_5$1 = { class: "flex flex-wrap gap-2" };
	var _hoisted_6$1 = ["onClick"];
	var _hoisted_7 = { class: "sm:ml-4" };
	var _hoisted_8 = { class: "relative" };
	var _hoisted_9 = ["value"];
	var _hoisted_10 = ["value"];
	//#endregion
	//#region src/components/AltPilotFilter.vue
	var AltPilotFilter_default = /* @__PURE__ */ defineComponent({
		__name: "AltPilotFilter",
		setup(__props) {
			const { sites } = useGlobalState();
			const { sort, fetchAssets, filter, pagination } = useAssets();
			const filterOptions = [
				{
					value: "all",
					label: "all"
				},
				{
					value: "missing",
					label: "missing"
				},
				{
					value: "manual",
					label: "manually"
				},
				{
					value: "ai-generated",
					label: "AI-generated"
				}
			];
			const setFilter = (value) => {
				if (filter.value === value) return;
				filter.value = value;
				fetchAssets({ offset: 0 });
			};
			const sortOptions = [
				{
					value: "dateUpdated",
					label: "last edited"
				},
				{
					value: "dateCreated",
					label: "last uploaded"
				},
				{
					value: "filename",
					label: "filename"
				}
			];
			const setSort = (value) => {
				if (sort.value === value) return;
				sort.value = value;
				fetchAssets({ offset: 0 });
			};
			const onSortChange = (event) => {
				const target = event.target;
				if (!target) return;
				setSort(target.value);
			};
			return (_ctx, _cache) => {
				return openBlock(), createElementBlock("div", _hoisted_1$3, [createBaseVNode("div", _hoisted_2$3, [createBaseVNode("div", null, [_cache[0] || (_cache[0] = createBaseVNode("div", { class: "mb-ap-title-p text-sm text-ap-dark-green" }, "showing results", -1)), createBaseVNode("div", _hoisted_3$3, " alt texts for " + toDisplayString(unref(pagination)?.total || 0) + " images in " + toDisplayString(unref(sites).length) + " languages ", 1)]), createBaseVNode("div", _hoisted_4$3, [createBaseVNode("div", null, [_cache[1] || (_cache[1] = createBaseVNode("p", { class: "mb-1 mb-ap-title-p text-sm leading-[1.2] text-ap-dark-green" }, "filter", -1)), createBaseVNode("ul", _hoisted_5$1, [(openBlock(), createElementBlock(Fragment, null, renderList(filterOptions, (option) => {
					return createBaseVNode("li", { key: option.value }, [createBaseVNode("button", {
						type: "button",
						onClick: ($event) => setFilter(option.value),
						class: normalizeClass(["rounded-full border border-ap-dark-green px-3 py-1 text-xs leading-none transition-colors hover:bg-ap-light-green/30", unref(filter) === option.value ? "bg-ap-light-green text-black" : "text-ap-dark-green"])
					}, toDisplayString(option.label), 11, _hoisted_6$1)]);
				}), 64))])]), createBaseVNode("div", _hoisted_7, [_cache[3] || (_cache[3] = createBaseVNode("p", { class: "mb-1 mb-ap-title-p text-sm leading-[1.2] text-ap-dark-green" }, "sort by", -1)), createBaseVNode("div", _hoisted_8, [createBaseVNode("select", {
					class: "w-full appearance-none rounded-full border border-ap-dark-green py-1 pr-8 pl-3 text-xs leading-[1.2] text-ap-dark-green focus:ring-1 focus:ring-ap-dark-green focus:outline-none",
					value: unref(sort),
					onChange: onSortChange
				}, [(openBlock(), createElementBlock(Fragment, null, renderList(sortOptions, (option) => {
					return createBaseVNode("option", {
						key: option.value,
						value: option.value
					}, toDisplayString(option.label), 9, _hoisted_10);
				}), 64))], 40, _hoisted_9), _cache[2] || (_cache[2] = createBaseVNode("span", {
					class: "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ap-dark-green",
					"aria-hidden": "true"
				}, [createBaseVNode("svg", {
					class: "h-2.5 w-2.5",
					viewBox: "0 0 10 6",
					fill: "none",
					xmlns: "http://www.w3.org/2000/svg"
				}, [createBaseVNode("path", {
					d: "M1 1L5 5L9 1",
					stroke: "currentColor",
					"stroke-width": "1.5",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				})])], -1))])])])])]);
			};
		}
	});
	//#endregion
	//#region src/components/AltPilotHeader.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$2 = { class: "grid grid-cols-[max-content_max-content_1fr] items-start gap-x-6 gap-y-4 border-b border-ap-dark-green max-md:grid-cols-2 max-md:pb-4" };
	var _hoisted_2$2 = { class: "justify-self-start" };
	var _hoisted_3$2 = { class: "justify-self-start" };
	var _hoisted_4$2 = { class: "w-full max-w-lg justify-self-end pt-1" };
	//#endregion
	//#region src/components/AltPilotHeader.vue
	var AltPilotHeader_default = /* @__PURE__ */ defineComponent({
		__name: "AltPilotHeader",
		setup(__props) {
			return (_ctx, _cache) => {
				return openBlock(), createElementBlock("div", null, [createBaseVNode("div", _hoisted_1$2, [
					createBaseVNode("div", _hoisted_2$2, [createVNode(AltPilotHeaderTotal_default)]),
					createBaseVNode("div", _hoisted_3$2, [createVNode(AltPilotHeaderStats_default)]),
					createBaseVNode("div", _hoisted_4$2, [createVNode(AltPilotSearch_default)])
				]), createVNode(AltPilotFilter_default, { class: "mt-4" })]);
			};
		}
	});
	//#endregion
	//#region src/components/AltPilotToaster.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1$1 = { class: "px-3 py-2 pr-9" };
	var _hoisted_2$1 = { class: "min-w-0" };
	var _hoisted_3$1 = {
		key: 0,
		class: "flex justify-end px-3 pb-2"
	};
	var _hoisted_4$1 = ["onClick"];
	//#endregion
	//#region src/components/AltPilotToaster.vue
	var AltPilotToaster_default = /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
		__name: "AltPilotToaster",
		setup(__props) {
			const { toasts, dismiss, onOpenChange } = useToasts();
			return (_ctx, _cache) => {
				return openBlock(), createBlock(unref(ToastProvider_default), {
					duration: 5e3,
					"swipe-direction": "right"
				}, {
					default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(toasts), (t) => {
						return openBlock(), createBlock(unref(ToastRoot_default), {
							key: t.id,
							open: t.open,
							"onUpdate:open": [($event) => t.open = $event, (open) => unref(onOpenChange)(t.id, open)],
							duration: t.duration,
							type: t.type,
							class: "toast-transition relative w-full overflow-hidden rounded-2xl border border-ap-dark-green bg-ap-light-green text-ap-dark-green"
						}, {
							default: withCtx(() => [
								createVNode(unref(ToastClose_default), { "as-child": "" }, {
									default: withCtx(() => [..._cache[0] || (_cache[0] = [createBaseVNode("button", {
										type: "button",
										class: "absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full border-ap-dark-green text-ap-dark-green transition-colors hover:border hover:bg-ap-dark-green/10",
										"aria-label": "Close"
									}, [createBaseVNode("svg", {
										"aria-hidden": "true",
										viewBox: "0 0 12 12",
										class: "h-2.5 w-2.5"
									}, [createBaseVNode("path", {
										d: "M2 2 L10 10 M10 2 L2 10",
										stroke: "currentColor",
										"stroke-width": "1.8",
										"stroke-linecap": "round"
									})])], -1)])]),
									_: 1
								}),
								createBaseVNode("div", _hoisted_1$1, [createBaseVNode("div", _hoisted_2$1, [t.title ? (openBlock(), createBlock(unref(ToastTitle_default), {
									key: 0,
									class: "text-xs leading-tight text-ap-dark-green uppercase"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(t.title), 1)]),
									_: 2
								}, 1024)) : createCommentVNode("", true), createVNode(unref(ToastDescription_default), { class: "text-sm leading-snug text-ap-dark-green" }, {
									default: withCtx(() => [createTextVNode(toDisplayString(t.description), 1)]),
									_: 2
								}, 1024)])]),
								t.action ? (openBlock(), createElementBlock("div", _hoisted_3$1, [createVNode(unref(ToastAction_default), {
									"as-child": "",
									"alt-text": t.action.altText
								}, {
									default: withCtx(() => [createBaseVNode("button", {
										type: "button",
										class: "rounded-full border border-ap-dark-green px-2.5 py-0.5 text-xs text-ap-dark-green transition-colors hover:bg-ap-light-green/30",
										onClick: () => {
											t.action?.onClick();
											unref(dismiss)(t.id);
										}
									}, toDisplayString(t.action.label), 9, _hoisted_4$1)]),
									_: 2
								}, 1032, ["alt-text"])])) : createCommentVNode("", true)
							]),
							_: 2
						}, 1032, [
							"open",
							"onUpdate:open",
							"duration",
							"type"
						]);
					}), 128)), createVNode(unref(ToastViewport_default), { class: "fixed right-3 bottom-3 z-50 flex max-h-[calc(100vh-1.5rem)] w-[300px] max-w-[calc(100vw-1.5rem)] flex-col gap-1.5 outline-none" })]),
					_: 1
				});
			};
		}
	}), [["__scopeId", "data-v-9286cb23"]]);
	//#endregion
	//#region src/App.vue?vue&type=script&setup=true&lang.ts
	var _hoisted_1 = { id: "altPilotWrapper" };
	var _hoisted_2 = {
		key: 0,
		class: "mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800"
	};
	var _hoisted_3 = ["href"];
	var _hoisted_4 = { class: "relative" };
	var _hoisted_5 = {
		key: "loading",
		class: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6"
	};
	var _hoisted_6 = {
		key: "loaded",
		class: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6"
	};
	var ASSET_CARD_LIMIT = 36;
	//#endregion
	//#region src/App.vue
	var App_default = /* @__PURE__ */ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
		__name: "App",
		props: {
			cpTrigger: {},
			csrfToken: {},
			sites: {},
			primarySiteId: {},
			hasSelectedVolumes: { type: Boolean }
		},
		setup(__props) {
			const state = useGlobalState();
			const { fetchAssets, query } = useAssets();
			const queryParam = new URLSearchParams(window.location.search).get("query");
			if (queryParam) query.value = queryParam;
			state.csrfToken.value = __props.csrfToken;
			state.cpTrigger.value = __props.cpTrigger;
			state.sites.value = __props.sites;
			state.primarySiteId.value = __props.primarySiteId;
			state.hasSelectedVolumes.value = __props.hasSelectedVolumes;
			const { assets, assetIds, loading, pagination } = useAssets({ defaultLimit: ASSET_CARD_LIMIT });
			const { fetchStatusCounts } = useStatusCounts();
			const showLoading = computed(() => loading.value);
			const lightboxOpen = /* @__PURE__ */ ref(false);
			const initialLightboxAssetId = /* @__PURE__ */ ref(null);
			const openLightbox = (assetId) => {
				initialLightboxAssetId.value = assetId;
				lightboxOpen.value = true;
			};
			const handlePrevious = () => {
				if (!pagination.value) return;
				fetchAssets({
					offset: Math.max(0, pagination.value.offset - pagination.value.limit),
					limit: pagination.value.limit
				});
			};
			const handleNext = () => {
				if (!pagination.value) return;
				fetchAssets({
					offset: pagination.value.offset + pagination.value.limit,
					limit: pagination.value.limit
				});
			};
			const handlePageChange = (page) => {
				if (!pagination.value) return;
				fetchAssets({
					offset: (page - 1) * pagination.value.limit,
					limit: pagination.value.limit
				});
			};
			const sortedAssets = computed(() => {
				return assetIds.value.map((id) => assets.value[id]).filter((asset) => asset !== void 0);
			});
			onMounted(() => {
				fetchAssets();
				fetchStatusCounts();
			});
			return (_ctx, _cache) => {
				return openBlock(), createElementBlock("div", _hoisted_1, [
					!__props.hasSelectedVolumes ? (openBlock(), createElementBlock("div", _hoisted_2, [createBaseVNode("p", null, [
						_cache[1] || (_cache[1] = createTextVNode(" No volumes selected. Please configure the ", -1)),
						createBaseVNode("a", {
							href: `/${__props.cpTrigger}/settings/plugins/altpilot`,
							class: "font-bold underline hover:text-yellow-900"
						}, "settings", 8, _hoisted_3),
						_cache[2] || (_cache[2] = createTextVNode(". ", -1))
					])])) : createCommentVNode("", true),
					createVNode(AltPilotHeader_default),
					createBaseVNode("div", _hoisted_4, [createVNode(Transition, { name: "asset-grid-fade" }, {
						default: withCtx(() => [showLoading.value ? (openBlock(), createElementBlock("div", _hoisted_5, [(openBlock(), createElementBlock(Fragment, null, renderList(ASSET_CARD_LIMIT, (i) => {
							return createBaseVNode("div", {
								key: `skeleton-${i}`,
								class: "h-full"
							}, [createVNode(AssetCardSkeleton_default)]);
						}), 64))])) : (openBlock(), createElementBlock("div", _hoisted_6, [(openBlock(true), createElementBlock(Fragment, null, renderList(unref(assetIds), (id) => {
							return openBlock(), createElementBlock("div", {
								key: id,
								class: "h-full"
							}, [unref(assets)[id] ? (openBlock(), createBlock(AssetCard_default, {
								key: 0,
								asset: unref(assets)[id],
								onClickImage: openLightbox
							}, null, 8, ["asset"])) : createCommentVNode("", true)]);
						}), 128))]))]),
						_: 1
					})]),
					!showLoading.value ? (openBlock(), createBlock(AssetPagination_default, {
						key: 1,
						pagination: unref(pagination),
						onPrevious: handlePrevious,
						onNext: handleNext,
						onPageChange: handlePageChange
					}, null, 8, ["pagination"])) : createCommentVNode("", true),
					createVNode(AltPilotToaster_default),
					createVNode(AssetLightbox_default, {
						open: lightboxOpen.value,
						"onUpdate:open": _cache[0] || (_cache[0] = ($event) => lightboxOpen.value = $event),
						"initial-asset-id": initialLightboxAssetId.value,
						assets: sortedAssets.value,
						"primary-site-id": __props.primarySiteId
					}, null, 8, [
						"open",
						"initial-asset-id",
						"assets",
						"primary-site-id"
					])
				]);
			};
		}
	}), [["__scopeId", "data-v-cd34fbaf"]]);
	//#endregion
	//#region src/main.ts
	document.addEventListener("DOMContentLoaded", () => {
		document.querySelectorAll("#altpilot-app").forEach((el) => {
			createApp(App_default, JSON.parse(el.dataset.props || "{}")).mount(el);
		});
	});
	//#endregion
})();

//# sourceMappingURL=main.js.map