(function() {
  "use strict";
  // @__NO_SIDE_EFFECTS__
  function makeMap(str) {
    const map = /* @__PURE__ */ Object.create(null);
    for (const key of str.split(",")) map[key] = 1;
    return (val) => val in map;
  }
  const EMPTY_OBJ = {};
  const EMPTY_ARR = [];
  const NOOP = () => {
  };
  const NO = () => false;
  const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  const isArray = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isDate = (val) => toTypeString(val) === "[object Date]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject$1 = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return (isObject$1(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject$2 = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return ((str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    });
  };
  const camelizeRE = /-\w/g;
  const camelize = cacheStringFunction(
    (str) => {
      return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
    }
  );
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  });
  const toHandlerKey = cacheStringFunction(
    (str) => {
      const s = str ? `on${capitalize(str)}` : ``;
      return s;
    }
  );
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, ...arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](...arg);
    }
  };
  const def = (obj, key, value, writable = false) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  const toNumber = (val) => {
    const n = isString(val) ? Number(val) : NaN;
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value) || isObject$1(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*[^]*?\*\//g;
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
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject$1(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  function normalizeProps(props) {
    if (!props) return null;
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (style) {
      props.style = normalizeStyle(style);
    }
    return props;
  }
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  function looseCompareArrays(a, b) {
    if (a.length !== b.length) return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
      equal = looseEqual(a[i], b[i]);
    }
    return equal;
  }
  function looseEqual(a, b) {
    if (a === b) return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isSymbol(a);
    bValidType = isSymbol(b);
    if (aValidType || bValidType) {
      return a === b;
    }
    aValidType = isArray(a);
    bValidType = isArray(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject$1(a);
    bValidType = isObject$1(b);
    if (aValidType || bValidType) {
      if (!aValidType || !bValidType) {
        return false;
      }
      const aKeysCount = Object.keys(a).length;
      const bKeysCount = Object.keys(b).length;
      if (aKeysCount !== bKeysCount) {
        return false;
      }
      for (const key in a) {
        const aHasKey = a.hasOwnProperty(key);
        const bHasKey = b.hasOwnProperty(key);
        if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
          return false;
        }
      }
    }
    return String(a) === String(b);
  }
  function looseIndexOf(arr, val) {
    return arr.findIndex((item) => looseEqual(item, val));
  }
  const isRef$1 = (val) => {
    return !!(val && val["__v_isRef"] === true);
  };
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (isRef$1(val)) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce(
          (entries, [key, val2], i) => {
            entries[stringifySymbol(key, i) + " =>"] = val2;
            return entries;
          },
          {}
        )
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
      };
    } else if (isSymbol(val)) {
      return stringifySymbol(val);
    } else if (isObject$1(val) && !isArray(val) && !isPlainObject$2(val)) {
      return String(val);
    }
    return val;
  };
  const stringifySymbol = (v, i = "") => {
    var _a;
    return (
      // Symbol.description in es2019+ so we need to cast here to pass
      // the lib: es2016 check
      isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
    );
  };
  var define_process_env_default$1 = { NODE_ENV: "production" };
  let activeEffectScope;
  class EffectScope {
    // TODO isolatedDeclarations "__v_skip"
    constructor(detached = false) {
      this.detached = detached;
      this._active = true;
      this._on = 0;
      this.effects = [];
      this.cleanups = [];
      this._isPaused = false;
      this.__v_skip = true;
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      }
    }
    get active() {
      return this._active;
    }
    pause() {
      if (this._active) {
        this._isPaused = true;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].pause();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].pause();
        }
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
          if (this.scopes) {
            for (i = 0, l = this.scopes.length; i < l; i++) {
              this.scopes[i].resume();
            }
          }
          for (i = 0, l = this.effects.length; i < l; i++) {
            this.effects[i].resume();
          }
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
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        this.effects.length = 0;
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        this.cleanups.length = 0;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
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
  }
  function effectScope(detached) {
    return new EffectScope(detached);
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  function onScopeDispose(fn, failSilently = false) {
    if (activeEffectScope) {
      activeEffectScope.cleanups.push(fn);
    }
  }
  let activeSub;
  const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
  class ReactiveEffect {
    constructor(fn) {
      this.fn = fn;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 1 | 4;
      this.next = void 0;
      this.cleanup = void 0;
      this.scheduler = void 0;
      if (activeEffectScope && activeEffectScope.active) {
        activeEffectScope.effects.push(this);
      }
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
      if (this.flags & 2 && !(this.flags & 32)) {
        return;
      }
      if (!(this.flags & 8)) {
        batch(this);
      }
    }
    run() {
      if (!(this.flags & 1)) {
        return this.fn();
      }
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
        for (let link = this.deps; link; link = link.nextDep) {
          removeSub(link);
        }
        this.deps = this.depsTail = void 0;
        cleanupEffect(this);
        this.onStop && this.onStop();
        this.flags &= -2;
      }
    }
    trigger() {
      if (this.flags & 64) {
        pausedQueueEffects.add(this);
      } else if (this.scheduler) {
        this.scheduler();
      } else {
        this.runIfDirty();
      }
    }
    /**
     * @internal
     */
    runIfDirty() {
      if (isDirty(this)) {
        this.run();
      }
    }
    get dirty() {
      return isDirty(this);
    }
  }
  let batchDepth = 0;
  let batchedSub;
  let batchedComputed;
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
    if (--batchDepth > 0) {
      return;
    }
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
        if (e.flags & 1) {
          try {
            ;
            e.trigger();
          } catch (err) {
            if (!error) error = err;
          }
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
      } else {
        head = link;
      }
      link.dep.activeLink = link.prevActiveLink;
      link.prevActiveLink = void 0;
      link = prev;
    }
    sub.deps = head;
    sub.depsTail = tail;
  }
  function isDirty(sub) {
    for (let link = sub.deps; link; link = link.nextDep) {
      if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
        return true;
      }
    }
    if (sub._dirty) {
      return true;
    }
    return false;
  }
  function refreshComputed(computed2) {
    if (computed2.flags & 4 && !(computed2.flags & 16)) {
      return;
    }
    computed2.flags &= -17;
    if (computed2.globalVersion === globalVersion) {
      return;
    }
    computed2.globalVersion = globalVersion;
    if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
      return;
    }
    computed2.flags |= 2;
    const dep = computed2.dep;
    const prevSub = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = computed2;
    shouldTrack = true;
    try {
      prepareDeps(computed2);
      const value = computed2.fn(computed2._value);
      if (dep.version === 0 || hasChanged(value, computed2._value)) {
        computed2.flags |= 128;
        computed2._value = value;
        dep.version++;
      }
    } catch (err) {
      dep.version++;
      throw err;
    } finally {
      activeSub = prevSub;
      shouldTrack = prevShouldTrack;
      cleanupDeps(computed2);
      computed2.flags &= -3;
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
        for (let l = dep.computed.deps; l; l = l.nextDep) {
          removeSub(l, true);
        }
      }
    }
    if (!soft && !--dep.sc && dep.map) {
      dep.map.delete(dep.key);
    }
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
  let shouldTrack = true;
  const trackStack = [];
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
  let globalVersion = 0;
  class Link {
    constructor(sub, dep) {
      this.sub = sub;
      this.dep = dep;
      this.version = dep.version;
      this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
    }
  }
  class Dep {
    // TODO isolatedDeclarations "__v_skip"
    constructor(computed2) {
      this.computed = computed2;
      this.version = 0;
      this.activeLink = void 0;
      this.subs = void 0;
      this.map = void 0;
      this.key = void 0;
      this.sc = 0;
      this.__v_skip = true;
    }
    track(debugInfo) {
      if (!activeSub || !shouldTrack || activeSub === this.computed) {
        return;
      }
      let link = this.activeLink;
      if (link === void 0 || link.sub !== activeSub) {
        link = this.activeLink = new Link(activeSub, this);
        if (!activeSub.deps) {
          activeSub.deps = activeSub.depsTail = link;
        } else {
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
          if (link.prevDep) {
            link.prevDep.nextDep = next;
          }
          link.prevDep = activeSub.depsTail;
          link.nextDep = void 0;
          activeSub.depsTail.nextDep = link;
          activeSub.depsTail = link;
          if (activeSub.deps === link) {
            activeSub.deps = next;
          }
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
        if (!!(define_process_env_default$1.NODE_ENV !== "production")) ;
        for (let link = this.subs; link; link = link.prevSub) {
          if (link.sub.notify()) {
            ;
            link.sub.dep.notify();
          }
        }
      } finally {
        endBatch();
      }
    }
  }
  function addSub(link) {
    link.dep.sc++;
    if (link.sub.flags & 4) {
      const computed2 = link.dep.computed;
      if (computed2 && !link.dep.subs) {
        computed2.flags |= 4 | 16;
        for (let l = computed2.deps; l; l = l.nextDep) {
          addSub(l);
        }
      }
      const currentTail = link.dep.subs;
      if (currentTail !== link) {
        link.prevSub = currentTail;
        if (currentTail) currentTail.nextSub = link;
      }
      link.dep.subs = link;
    }
  }
  const targetMap = /* @__PURE__ */ new WeakMap();
  const ITERATE_KEY = /* @__PURE__ */ Symbol(
    ""
  );
  const MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol(
    ""
  );
  const ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol(
    ""
  );
  function track(target, type, key) {
    if (shouldTrack && activeSub) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = new Dep());
        dep.map = depsMap;
        dep.key = key;
      }
      {
        dep.track();
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      globalVersion++;
      return;
    }
    const run = (dep) => {
      if (dep) {
        {
          dep.trigger();
        }
      }
    };
    startBatch();
    if (type === "clear") {
      depsMap.forEach(run);
    } else {
      const targetIsArray = isArray(target);
      const isArrayIndex = targetIsArray && isIntegerKey(key);
      if (targetIsArray && key === "length") {
        const newLength = Number(newValue);
        depsMap.forEach((dep, key2) => {
          if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
            run(dep);
          }
        });
      } else {
        if (key !== void 0 || depsMap.has(void 0)) {
          run(depsMap.get(key));
        }
        if (isArrayIndex) {
          run(depsMap.get(ARRAY_ITERATE_KEY));
        }
        switch (type) {
          case "add":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            } else if (isArrayIndex) {
              run(depsMap.get("length"));
            }
            break;
          case "delete":
            if (!targetIsArray) {
              run(depsMap.get(ITERATE_KEY));
              if (isMap(target)) {
                run(depsMap.get(MAP_KEY_ITERATE_KEY));
              }
            }
            break;
          case "set":
            if (isMap(target)) {
              run(depsMap.get(ITERATE_KEY));
            }
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
    if (/* @__PURE__ */ isReadonly(target)) {
      return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
    }
    return toReactive(item);
  }
  const arrayInstrumentations = {
    __proto__: null,
    [Symbol.iterator]() {
      return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
    },
    concat(...args) {
      return reactiveReadArray(this).concat(
        ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
      );
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
      return apply(
        this,
        "filter",
        fn,
        thisArg,
        (v) => v.map((item) => toWrapped(this, item)),
        arguments
      );
    },
    find(fn, thisArg) {
      return apply(
        this,
        "find",
        fn,
        thisArg,
        (item) => toWrapped(this, item),
        arguments
      );
    },
    findIndex(fn, thisArg) {
      return apply(this, "findIndex", fn, thisArg, void 0, arguments);
    },
    findLast(fn, thisArg) {
      return apply(
        this,
        "findLast",
        fn,
        thisArg,
        (item) => toWrapped(this, item),
        arguments
      );
    },
    findLastIndex(fn, thisArg) {
      return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
    },
    // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
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
    // keys() iterator only reads `length`, no optimization required
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
    // slice could use ARRAY_ITERATE but also seems to beg for range tracking
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
  function iterator(self2, method, wrapValue) {
    const arr = shallowReadArray(self2);
    const iter = arr[method]();
    if (arr !== self2 && !/* @__PURE__ */ isShallow(self2)) {
      iter._next = iter.next;
      iter.next = () => {
        const result = iter._next();
        if (!result.done) {
          result.value = wrapValue(result.value);
        }
        return result;
      };
    }
    return iter;
  }
  const arrayProto = Array.prototype;
  function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
    const arr = shallowReadArray(self2);
    const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
    const methodFn = arr[method];
    if (methodFn !== arrayProto[method]) {
      const result2 = methodFn.apply(self2, args);
      return needsWrap ? toReactive(result2) : result2;
    }
    let wrappedFn = fn;
    if (arr !== self2) {
      if (needsWrap) {
        wrappedFn = function(item, index) {
          return fn.call(this, toWrapped(self2, item), index, self2);
        };
      } else if (fn.length > 2) {
        wrappedFn = function(item, index) {
          return fn.call(this, item, index, self2);
        };
      }
    }
    const result = methodFn.call(arr, wrappedFn, thisArg);
    return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
  }
  function reduce(self2, method, fn, args) {
    const arr = shallowReadArray(self2);
    let wrappedFn = fn;
    if (arr !== self2) {
      if (!/* @__PURE__ */ isShallow(self2)) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, toWrapped(self2, item), index, self2);
        };
      } else if (fn.length > 3) {
        wrappedFn = function(acc, item, index) {
          return fn.call(this, acc, item, index, self2);
        };
      }
    }
    return arr[method](wrappedFn, ...args);
  }
  function searchProxy(self2, method, args) {
    const arr = /* @__PURE__ */ toRaw(self2);
    track(arr, "iterate", ARRAY_ITERATE_KEY);
    const res = arr[method](...args);
    if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
      args[0] = /* @__PURE__ */ toRaw(args[0]);
      return arr[method](...args);
    }
    return res;
  }
  function noTracking(self2, method, args = []) {
    pauseTracking();
    startBatch();
    const res = (/* @__PURE__ */ toRaw(self2))[method].apply(self2, args);
    endBatch();
    resetTracking();
    return res;
  }
  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  function hasOwnProperty(key) {
    if (!isSymbol(key)) key = String(key);
    const obj = /* @__PURE__ */ toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  class BaseReactiveHandler {
    constructor(_isReadonly = false, _isShallow = false) {
      this._isReadonly = _isReadonly;
      this._isShallow = _isShallow;
    }
    get(target, key, receiver) {
      if (key === "__v_skip") return target["__v_skip"];
      const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return isShallow2;
      } else if (key === "__v_raw") {
        if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
        // this means the receiver is a user proxy of the reactive proxy
        Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
          return target;
        }
        return;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        let fn;
        if (targetIsArray && (fn = arrayInstrumentations[key])) {
          return fn;
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(
        target,
        key,
        // if this is a proxy wrapping a ref, return methods using the raw ref
        // as receiver so that we don't have to call `toRaw` on the ref in all
        // its class methods
        /* @__PURE__ */ isRef(target) ? target : receiver
      );
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (isShallow2) {
        return res;
      }
      if (/* @__PURE__ */ isRef(res)) {
        const value = targetIsArray && isIntegerKey(key) ? res : res.value;
        return isReadonly2 && isObject$1(value) ? /* @__PURE__ */ readonly(value) : value;
      }
      if (isObject$1(res)) {
        return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
      }
      return res;
    }
  }
  class MutableReactiveHandler extends BaseReactiveHandler {
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
        if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
          if (isOldValueReadonly) {
            return true;
          } else {
            oldValue.value = value;
            return true;
          }
        }
      }
      const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(
        target,
        key,
        value,
        /* @__PURE__ */ isRef(target) ? target : receiver
      );
      if (target === /* @__PURE__ */ toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
      }
      return result;
    }
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key);
      target[key];
      const result = Reflect.deleteProperty(target, key);
      if (result && hadKey) {
        trigger(target, "delete", key, void 0);
      }
      return result;
    }
    has(target, key) {
      const result = Reflect.has(target, key);
      if (!isSymbol(key) || !builtInSymbols.has(key)) {
        track(target, "has", key);
      }
      return result;
    }
    ownKeys(target) {
      track(
        target,
        "iterate",
        isArray(target) ? "length" : ITERATE_KEY
      );
      return Reflect.ownKeys(target);
    }
  }
  class ReadonlyReactiveHandler extends BaseReactiveHandler {
    constructor(isShallow2 = false) {
      super(true, isShallow2);
    }
    set(target, key) {
      return true;
    }
    deleteProperty(target, key) {
      return true;
    }
  }
  const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
  const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
  const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
  const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return extend(
        // inheriting all iterator properties
        Object.create(innerIterator),
        {
          // iterator protocol
          next() {
            const { value, done } = innerIterator.next();
            return done ? { value, done } : {
              value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
              done
            };
          }
        }
      );
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      return type === "delete" ? false : type === "clear" ? void 0 : this;
    };
  }
  function createInstrumentations(readonly2, shallow) {
    const instrumentations = {
      get(key) {
        const target = this["__v_raw"];
        const rawTarget = /* @__PURE__ */ toRaw(target);
        const rawKey = /* @__PURE__ */ toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "get", key);
          }
          track(rawTarget, "get", rawKey);
        }
        const { has } = getProto(rawTarget);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        if (has.call(rawTarget, key)) {
          return wrap(target.get(key));
        } else if (has.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
        } else if (target !== rawTarget) {
          target.get(key);
        }
      },
      get size() {
        const target = this["__v_raw"];
        !readonly2 && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
        return target.size;
      },
      has(key) {
        const target = this["__v_raw"];
        const rawTarget = /* @__PURE__ */ toRaw(target);
        const rawKey = /* @__PURE__ */ toRaw(key);
        if (!readonly2) {
          if (hasChanged(key, rawKey)) {
            track(rawTarget, "has", key);
          }
          track(rawTarget, "has", rawKey);
        }
        return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
      },
      forEach(callback, thisArg) {
        const observed = this;
        const target = observed["__v_raw"];
        const rawTarget = /* @__PURE__ */ toRaw(target);
        const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
        !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
        return target.forEach((value, key) => {
          return callback.call(thisArg, wrap(value), wrap(key), observed);
        });
      }
    };
    extend(
      instrumentations,
      readonly2 ? {
        add: createReadonlyMethod("add"),
        set: createReadonlyMethod("set"),
        delete: createReadonlyMethod("delete"),
        clear: createReadonlyMethod("clear")
      } : {
        add(value) {
          if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
            value = /* @__PURE__ */ toRaw(value);
          }
          const target = /* @__PURE__ */ toRaw(this);
          const proto = getProto(target);
          const hadKey = proto.has.call(target, value);
          if (!hadKey) {
            target.add(value);
            trigger(target, "add", value, value);
          }
          return this;
        },
        set(key, value) {
          if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
            value = /* @__PURE__ */ toRaw(value);
          }
          const target = /* @__PURE__ */ toRaw(this);
          const { has, get } = getProto(target);
          let hadKey = has.call(target, key);
          if (!hadKey) {
            key = /* @__PURE__ */ toRaw(key);
            hadKey = has.call(target, key);
          }
          const oldValue = get.call(target, key);
          target.set(key, value);
          if (!hadKey) {
            trigger(target, "add", key, value);
          } else if (hasChanged(value, oldValue)) {
            trigger(target, "set", key, value);
          }
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
          get ? get.call(target, key) : void 0;
          const result = target.delete(key);
          if (hadKey) {
            trigger(target, "delete", key, void 0);
          }
          return result;
        },
        clear() {
          const target = /* @__PURE__ */ toRaw(this);
          const hadItems = target.size !== 0;
          const result = target.clear();
          if (hadItems) {
            trigger(
              target,
              "clear",
              void 0,
              void 0
            );
          }
          return result;
        }
      }
    );
    const iteratorMethods = [
      "keys",
      "values",
      "entries",
      Symbol.iterator
    ];
    iteratorMethods.forEach((method) => {
      instrumentations[method] = createIterableMethod(method, readonly2, shallow);
    });
    return instrumentations;
  }
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = createInstrumentations(isReadonly2, shallow);
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  // @__NO_SIDE_EFFECTS__
  function reactive(target) {
    if (/* @__PURE__ */ isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  // @__NO_SIDE_EFFECTS__
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      false,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  // @__NO_SIDE_EFFECTS__
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  // @__NO_SIDE_EFFECTS__
  function shallowReadonly(target) {
    return createReactiveObject(
      target,
      true,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject$1(target)) {
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  // @__NO_SIDE_EFFECTS__
  function isReactive(value) {
    if (/* @__PURE__ */ isReadonly(value)) {
      return /* @__PURE__ */ isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  // @__NO_SIDE_EFFECTS__
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  // @__NO_SIDE_EFFECTS__
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  // @__NO_SIDE_EFFECTS__
  function isProxy(value) {
    return value ? !!value["__v_raw"] : false;
  }
  // @__NO_SIDE_EFFECTS__
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? /* @__PURE__ */ toRaw(raw) : observed;
  }
  function markRaw(value) {
    if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
      def(value, "__v_skip", true);
    }
    return value;
  }
  const toReactive = (value) => isObject$1(value) ? /* @__PURE__ */ reactive(value) : value;
  const toReadonly = (value) => isObject$1(value) ? /* @__PURE__ */ readonly(value) : value;
  // @__NO_SIDE_EFFECTS__
  function isRef(r) {
    return r ? r["__v_isRef"] === true : false;
  }
  // @__NO_SIDE_EFFECTS__
  function ref(value) {
    return createRef(value, false);
  }
  // @__NO_SIDE_EFFECTS__
  function shallowRef(value) {
    return createRef(value, true);
  }
  function createRef(rawValue, shallow) {
    if (/* @__PURE__ */ isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, isShallow2) {
      this.dep = new Dep();
      this["__v_isRef"] = true;
      this["__v_isShallow"] = false;
      this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
      this._value = isShallow2 ? value : toReactive(value);
      this["__v_isShallow"] = isShallow2;
    }
    get value() {
      {
        this.dep.track();
      }
      return this._value;
    }
    set value(newValue) {
      const oldValue = this._rawValue;
      const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
      newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
      if (hasChanged(newValue, oldValue)) {
        this._rawValue = newValue;
        this._value = useDirectValue ? newValue : toReactive(newValue);
        {
          this.dep.trigger();
        }
      }
    }
  }
  function unref(ref2) {
    return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
  }
  function toValue(source) {
    return isFunction(source) ? source() : unref(source);
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  class CustomRefImpl {
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
  }
  function customRef(factory) {
    return new CustomRefImpl(factory);
  }
  // @__NO_SIDE_EFFECTS__
  function toRefs(object) {
    const ret = isArray(object) ? new Array(object.length) : {};
    for (const key in object) {
      ret[key] = propertyToRef(object, key);
    }
    return ret;
  }
  class ObjectRefImpl {
    constructor(_object, _key, _defaultValue) {
      this._object = _object;
      this._key = _key;
      this._defaultValue = _defaultValue;
      this["__v_isRef"] = true;
      this._value = void 0;
      this._raw = /* @__PURE__ */ toRaw(_object);
      let shallow = true;
      let obj = _object;
      if (!isArray(_object) || !isIntegerKey(String(_key))) {
        do {
          shallow = !/* @__PURE__ */ isProxy(obj) || /* @__PURE__ */ isShallow(obj);
        } while (shallow && (obj = obj["__v_raw"]));
      }
      this._shallow = shallow;
    }
    get value() {
      let val = this._object[this._key];
      if (this._shallow) {
        val = unref(val);
      }
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
  }
  class GetterRefImpl {
    constructor(_getter) {
      this._getter = _getter;
      this["__v_isRef"] = true;
      this["__v_isReadonly"] = true;
      this._value = void 0;
    }
    get value() {
      return this._value = this._getter();
    }
  }
  // @__NO_SIDE_EFFECTS__
  function toRef$1(source, key, defaultValue) {
    if (/* @__PURE__ */ isRef(source)) {
      return source;
    } else if (isFunction(source)) {
      return new GetterRefImpl(source);
    } else if (isObject$1(source) && arguments.length > 1) {
      return propertyToRef(source, key, defaultValue);
    } else {
      return /* @__PURE__ */ ref(source);
    }
  }
  function propertyToRef(source, key, defaultValue) {
    return new ObjectRefImpl(source, key, defaultValue);
  }
  class ComputedRefImpl {
    constructor(fn, setter, isSSR) {
      this.fn = fn;
      this.setter = setter;
      this._value = void 0;
      this.dep = new Dep(this);
      this.__v_isRef = true;
      this.deps = void 0;
      this.depsTail = void 0;
      this.flags = 16;
      this.globalVersion = globalVersion - 1;
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
      if (!(this.flags & 8) && // avoid infinite self recursion
      activeSub !== this) {
        batch(this, true);
        return true;
      }
    }
    get value() {
      const link = this.dep.track();
      refreshComputed(this);
      if (link) {
        link.version = this.dep.version;
      }
      return this._value;
    }
    set value(newValue) {
      if (this.setter) {
        this.setter(newValue);
      }
    }
  }
  // @__NO_SIDE_EFFECTS__
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, isSSR);
    return cRef;
  }
  const INITIAL_WATCHER_VALUE = {};
  const cleanupMap = /* @__PURE__ */ new WeakMap();
  let activeWatcher = void 0;
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
      if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0)
        return traverse(source2, 1);
      return traverse(source2);
    };
    let effect2;
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
        if (/* @__PURE__ */ isRef(s)) {
          return s.value;
        } else if (/* @__PURE__ */ isReactive(s)) {
          return reactiveGetter(s);
        } else if (isFunction(s)) {
          return call ? call(s, 2) : s();
        } else ;
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = call ? () => call(source, 2) : source;
      } else {
        getter = () => {
          if (cleanup) {
            pauseTracking();
            try {
              cleanup();
            } finally {
              resetTracking();
            }
          }
          const currentEffect = activeWatcher;
          activeWatcher = effect2;
          try {
            return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
          } finally {
            activeWatcher = currentEffect;
          }
        };
      }
    } else {
      getter = NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      const depth = deep === true ? Infinity : deep;
      getter = () => traverse(baseGetter(), depth);
    }
    const scope = getCurrentScope();
    const watchHandle = () => {
      effect2.stop();
      if (scope && scope.active) {
        remove(scope.effects, effect2);
      }
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
      if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
        return;
      }
      if (cb) {
        const newValue = effect2.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
          if (cleanup) {
            cleanup();
          }
          const currentWatcher = activeWatcher;
          activeWatcher = effect2;
          try {
            const args = [
              newValue,
              // pass undefined as the old value when it's changed for the first time
              oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
              boundCleanup
            ];
            oldValue = newValue;
            call ? call(cb, 3, args) : (
              // @ts-expect-error
              cb(...args)
            );
          } finally {
            activeWatcher = currentWatcher;
          }
        }
      } else {
        effect2.run();
      }
    };
    if (augmentJob) {
      augmentJob(job);
    }
    effect2 = new ReactiveEffect(getter);
    effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
    boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
    cleanup = effect2.onStop = () => {
      const cleanups = cleanupMap.get(effect2);
      if (cleanups) {
        if (call) {
          call(cleanups, 4);
        } else {
          for (const cleanup2 of cleanups) cleanup2();
        }
        cleanupMap.delete(effect2);
      }
    };
    if (cb) {
      if (immediate) {
        job(true);
      } else {
        oldValue = effect2.run();
      }
    } else if (scheduler) {
      scheduler(job.bind(null, true), true);
    } else {
      effect2.run();
    }
    watchHandle.pause = effect2.pause.bind(effect2);
    watchHandle.resume = effect2.resume.bind(effect2);
    watchHandle.stop = watchHandle;
    return watchHandle;
  }
  function traverse(value, depth = Infinity, seen) {
    if (depth <= 0 || !isObject$1(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Map();
    if ((seen.get(value) || 0) >= depth) {
      return value;
    }
    seen.set(value, depth);
    depth--;
    if (/* @__PURE__ */ isRef(value)) {
      traverse(value.value, depth, seen);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], depth, seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, depth, seen);
      });
    } else if (isPlainObject$2(value)) {
      for (const key in value) {
        traverse(value[key], depth, seen);
      }
      for (const key of Object.getOwnPropertySymbols(value)) {
        if (Object.prototype.propertyIsEnumerable.call(value, key)) {
          traverse(value[key], depth, seen);
        }
      }
    }
    return value;
  }
  var define_process_env_default = { NODE_ENV: "production" };
  const stack = [];
  let isWarning = false;
  function warn$1(msg, ...args) {
    if (isWarning) return;
    isWarning = true;
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(
        appWarnHandler,
        instance,
        11,
        [
          // eslint-disable-next-line no-restricted-syntax
          msg + args.map((a) => {
            var _a, _b;
            return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
          }).join(""),
          instance && instance.proxy,
          trace.map(
            ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
          ).join("\n"),
          trace
        ]
      );
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && // avoid spamming console during tests
      true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
    isWarning = false;
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i) => {
      logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(
      vnode.component,
      vnode.type,
      isRoot
    )}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (/* @__PURE__ */ isRef(value)) {
      value = formatProp(key, /* @__PURE__ */ toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = /* @__PURE__ */ toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
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
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    if (isArray(fn)) {
      const values = [];
      for (let i = 0; i < fn.length; i++) {
        values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
      }
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
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
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
    if (throwInProd) {
      throw err;
    } else {
      console.error(err);
    }
  }
  const queue = [];
  let flushIndex = -1;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  function nextTick(fn) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJob = queue[middle];
      const middleJobId = getId(middleJob);
      if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    return start;
  }
  function queueJob(job) {
    if (!(job.flags & 1)) {
      const jobId = getId(job);
      const lastJob = queue[queue.length - 1];
      if (!lastJob || // fast path when the job id is larger than the tail
      !(job.flags & 2) && jobId >= getId(lastJob)) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(jobId), 0, job);
      }
      job.flags |= 1;
      queueFlush();
    }
  }
  function queueFlush() {
    if (!currentFlushPromise) {
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
      if (activePostFlushCbs && cb.id === -1) {
        activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
      } else if (!(cb.flags & 1)) {
        pendingPostFlushCbs.push(cb);
        cb.flags |= 1;
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.flags & 2) {
        if (instance && cb.id !== instance.uid) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        cb();
        if (!(cb.flags & 4)) {
          cb.flags &= -2;
        }
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)].sort(
        (a, b) => getId(a) - getId(b)
      );
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        const cb = activePostFlushCbs[postFlushIndex];
        if (cb.flags & 4) {
          cb.flags &= -2;
        }
        if (!(cb.flags & 8)) cb();
        cb.flags &= -2;
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
  function flushJobs(seen) {
    const check = NOOP;
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && !(job.flags & 8)) {
          if (!!(define_process_env_default.NODE_ENV !== "production") && check(job)) ;
          if (job.flags & 4) {
            job.flags &= ~1;
          }
          callWithErrorHandling(
            job,
            job.i,
            job.i ? 15 : 14
          );
          if (!(job.flags & 4)) {
            job.flags &= ~1;
          }
        }
      }
    } finally {
      for (; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job) {
          job.flags &= -2;
        }
      }
      flushIndex = -1;
      queue.length = 0;
      flushPostFlushCbs();
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs();
      }
    }
  }
  let devtools$1;
  let buffer = [];
  let devtoolsNotInstalled = false;
  function emit$1(event, ...args) {
    if (devtools$1) {
      devtools$1.emit(event, ...args);
    } else if (!devtoolsNotInstalled) {
      buffer.push({ event, args });
    }
  }
  function setDevtoolsHook$1(hook, target) {
    var _a, _b;
    devtools$1 = hook;
    if (devtools$1) {
      devtools$1.enabled = true;
      buffer.forEach(({ event, args }) => devtools$1.emit(event, ...args));
      buffer = [];
    } else if (
      // handle late devtools injection - only do this if we are in an actual
      // browser environment to avoid the timer handle stalling test runner exit
      // (#4815)
      typeof window !== "undefined" && // some envs mock window but not fully
      window.HTMLElement && // also exclude jsdom
      // eslint-disable-next-line no-restricted-syntax
      !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
    ) {
      const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
      replay.push((newHook) => {
        setDevtoolsHook$1(newHook, target);
      });
      setTimeout(() => {
        if (!devtools$1) {
          target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
          devtoolsNotInstalled = true;
          buffer = [];
        }
      }, 3e3);
    } else {
      devtoolsNotInstalled = true;
      buffer = [];
    }
  }
  function devtoolsInitApp(app, version2) {
    emit$1("app:init", app, version2, {
      Fragment,
      Text,
      Comment,
      Static
    });
  }
  function devtoolsUnmountApp(app) {
    emit$1("app:unmount", app);
  }
  const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:added"
    /* COMPONENT_ADDED */
  );
  const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:updated"
    /* COMPONENT_UPDATED */
  );
  const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:removed"
    /* COMPONENT_REMOVED */
  );
  const devtoolsComponentRemoved = (component) => {
    if (devtools$1 && typeof devtools$1.cleanupBuffer === "function" && // remove the component if it wasn't buffered
    !devtools$1.cleanupBuffer(component)) {
      _devtoolsComponentRemoved(component);
    }
  };
  // @__NO_SIDE_EFFECTS__
  function createDevtoolsComponentHook(hook) {
    return (component) => {
      emit$1(
        hook,
        component.appContext.app,
        component.uid,
        component.parent ? component.parent.uid : void 0,
        component
      );
    };
  }
  function devtoolsComponentEmit(component, event, params) {
    emit$1(
      "component:emit",
      component.appContext.app,
      component,
      event,
      params
    );
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx) return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      {
        devtoolsComponentUpdated(ctx);
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  function withDirectives(vnode, directives) {
    if (currentRenderingInstance === null) {
      return vnode;
    }
    const instance = getComponentPublicInstance(currentRenderingInstance);
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (dir) {
        if (isFunction(dir)) {
          dir = {
            mounted: dir,
            updated: dir
          };
        }
        if (dir.deep) {
          traverse(value);
        }
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
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
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
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = getCurrentInstance();
    if (instance || currentApp) {
      let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else ;
    }
  }
  const ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      return ctx;
    }
  };
  function watchEffect(effect2, options) {
    return doWatch(effect2, null, options);
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
        const watchStopHandle = () => {
        };
        watchStopHandle.stop = NOOP;
        watchStopHandle.resume = NOOP;
        watchStopHandle.pause = NOOP;
        return watchStopHandle;
      }
    }
    const instance = currentInstance;
    baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
    let isPre = false;
    if (flush === "post") {
      baseWatchOptions.scheduler = (job) => {
        queuePostRenderEffect(job, instance && instance.suspense);
      };
    } else if (flush !== "sync") {
      isPre = true;
      baseWatchOptions.scheduler = (job, isFirstRun) => {
        if (isFirstRun) {
          job();
        } else {
          queueJob(job);
        }
      };
    }
    baseWatchOptions.augmentJob = (job) => {
      if (cb) {
        job.flags |= 4;
      }
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
      if (ssrCleanup) {
        ssrCleanup.push(watchHandle);
      } else if (runsImmediately) {
        watchHandle();
      }
    }
    return watchHandle;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
      cb = value;
    } else {
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
      for (let i = 0; i < segments.length && cur; i++) {
        cur = cur[segments[i]];
      }
      return cur;
    };
  }
  const TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
  const isTeleport = (type) => type.__isTeleport;
  const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
  const isTeleportDeferred = (props) => props && (props.defer || props.defer === "");
  const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
  const isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
  const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (isString(targetSelector)) {
      if (!select) {
        return null;
      } else {
        const target = select(targetSelector);
        return target;
      }
    } else {
      return targetSelector;
    }
  };
  const TeleportImpl = {
    name: "Teleport",
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
      const {
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        o: { insert, querySelector, createText, createComment }
      } = internals;
      const disabled = isTeleportDisabled(n2.props);
      let { shapeFlag, children, dynamicChildren } = n2;
      if (n1 == null) {
        const placeholder = n2.el = createText("");
        const mainAnchor = n2.anchor = createText("");
        insert(placeholder, container, anchor);
        insert(mainAnchor, container, anchor);
        const mount = (container2, anchor2) => {
          if (shapeFlag & 16) {
            mountChildren(
              children,
              container2,
              anchor2,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        };
        const mountToTarget = () => {
          const target = n2.target = resolveTarget(n2.props, querySelector);
          const targetAnchor = prepareAnchor(target, n2, createText, insert);
          if (target) {
            if (namespace !== "svg" && isTargetSVG(target)) {
              namespace = "svg";
            } else if (namespace !== "mathml" && isTargetMathML(target)) {
              namespace = "mathml";
            }
            if (parentComponent && parentComponent.isCE) {
              (parentComponent.ce._teleportTargets || (parentComponent.ce._teleportTargets = /* @__PURE__ */ new Set())).add(target);
            }
            if (!disabled) {
              mount(target, targetAnchor);
              updateCssVars(n2, false);
            }
          }
        };
        if (disabled) {
          mount(container, mainAnchor);
          updateCssVars(n2, true);
        }
        if (isTeleportDeferred(n2.props)) {
          n2.el.__isMounted = false;
          queuePostRenderEffect(() => {
            mountToTarget();
            delete n2.el.__isMounted;
          }, parentSuspense);
        } else {
          mountToTarget();
        }
      } else {
        if (isTeleportDeferred(n2.props) && n1.el.__isMounted === false) {
          queuePostRenderEffect(() => {
            TeleportImpl.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          }, parentSuspense);
          return;
        }
        n2.el = n1.el;
        n2.targetStart = n1.targetStart;
        const mainAnchor = n2.anchor = n1.anchor;
        const target = n2.target = n1.target;
        const targetAnchor = n2.targetAnchor = n1.targetAnchor;
        const wasDisabled = isTeleportDisabled(n1.props);
        const currentContainer = wasDisabled ? container : target;
        const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
        if (namespace === "svg" || isTargetSVG(target)) {
          namespace = "svg";
        } else if (namespace === "mathml" || isTargetMathML(target)) {
          namespace = "mathml";
        }
        if (dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            currentContainer,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          traverseStaticChildren(n1, n2, true);
        } else if (!optimized) {
          patchChildren(
            n1,
            n2,
            currentContainer,
            currentAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            false
          );
        }
        if (disabled) {
          if (!wasDisabled) {
            moveTeleport(
              n2,
              container,
              mainAnchor,
              internals,
              1
            );
          } else {
            if (n2.props && n1.props && n2.props.to !== n1.props.to) {
              n2.props.to = n1.props.to;
            }
          }
        } else {
          if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
            const nextTarget = n2.target = resolveTarget(
              n2.props,
              querySelector
            );
            if (nextTarget) {
              moveTeleport(
                n2,
                nextTarget,
                null,
                internals,
                0
              );
            }
          } else if (wasDisabled) {
            moveTeleport(
              n2,
              target,
              targetAnchor,
              internals,
              1
            );
          }
        }
        updateCssVars(n2, disabled);
      }
    },
    remove(vnode, parentComponent, parentSuspense, { um: unmount, o: { remove: hostRemove } }, doRemove) {
      const {
        shapeFlag,
        children,
        anchor,
        targetStart,
        targetAnchor,
        target,
        props
      } = vnode;
      if (target) {
        hostRemove(targetStart);
        hostRemove(targetAnchor);
      }
      doRemove && hostRemove(anchor);
      if (shapeFlag & 16) {
        const shouldRemove = doRemove || !isTeleportDisabled(props);
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(
            child,
            parentComponent,
            parentSuspense,
            shouldRemove,
            !!child.dynamicChildren
          );
        }
      }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport
  };
  function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
    if (moveType === 0) {
      insert(vnode.targetAnchor, container, parentAnchor);
    }
    const { el, anchor, shapeFlag, children, props } = vnode;
    const isReorder = moveType === 2;
    if (isReorder) {
      insert(el, container, parentAnchor);
    }
    if (!isReorder || isTeleportDisabled(props)) {
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          move(
            children[i],
            container,
            parentAnchor,
            2
          );
        }
      }
    }
    if (isReorder) {
      insert(anchor, container, parentAnchor);
    }
  }
  function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
    o: { nextSibling, parentNode, querySelector, insert, createText }
  }, hydrateChildren) {
    function hydrateAnchor(target2, targetNode) {
      let targetAnchor = targetNode;
      while (targetAnchor) {
        if (targetAnchor && targetAnchor.nodeType === 8) {
          if (targetAnchor.data === "teleport start anchor") {
            vnode.targetStart = targetAnchor;
          } else if (targetAnchor.data === "teleport anchor") {
            vnode.targetAnchor = targetAnchor;
            target2._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
            break;
          }
        }
        targetAnchor = nextSibling(targetAnchor);
      }
    }
    function hydrateDisabledTeleport(node2, vnode2) {
      vnode2.anchor = hydrateChildren(
        nextSibling(node2),
        vnode2,
        parentNode(node2),
        parentComponent,
        parentSuspense,
        slotScopeIds,
        optimized
      );
    }
    const target = vnode.target = resolveTarget(
      vnode.props,
      querySelector
    );
    const disabled = isTeleportDisabled(vnode.props);
    if (target) {
      const targetNode = target._lpa || target.firstChild;
      if (vnode.shapeFlag & 16) {
        if (disabled) {
          hydrateDisabledTeleport(node, vnode);
          hydrateAnchor(target, targetNode);
          if (!vnode.targetAnchor) {
            prepareAnchor(
              target,
              vnode,
              createText,
              insert,
              // if target is the same as the main view, insert anchors before current node
              // to avoid hydrating mismatch
              parentNode(node) === target ? node : null
            );
          }
        } else {
          vnode.anchor = nextSibling(node);
          hydrateAnchor(target, targetNode);
          if (!vnode.targetAnchor) {
            prepareAnchor(target, vnode, createText, insert);
          }
          hydrateChildren(
            targetNode && nextSibling(targetNode),
            vnode,
            target,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        }
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
  const Teleport = TeleportImpl;
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
  const leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
  const enterCbKey = /* @__PURE__ */ Symbol("_enterCb");
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
  const TransitionHookValidator = [Function, Array];
  const BaseTransitionPropsValidators = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  };
  const recursiveGetSubtree = (instance) => {
    const subTree = instance.subTree;
    return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
  };
  const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: BaseTransitionPropsValidators,
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      return () => {
        const children = slots.default && getTransitionRawChildren(slots.default(), true);
        if (!children || !children.length) {
          return;
        }
        const child = findNonCommentChild(children);
        const rawProps = /* @__PURE__ */ toRaw(props);
        const { mode } = rawProps;
        if (state.isLeaving) {
          return emptyPlaceholder(child);
        }
        const innerChild = getInnerChild$1(child);
        if (!innerChild) {
          return emptyPlaceholder(child);
        }
        let enterHooks = resolveTransitionHooks(
          innerChild,
          rawProps,
          state,
          instance,
          // #11061, ensure enterHooks is fresh after clone
          (hooks) => enterHooks = hooks
        );
        if (innerChild.type !== Comment) {
          setTransitionHooks(innerChild, enterHooks);
        }
        let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
        if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(oldInnerChild, innerChild) && recursiveGetSubtree(instance).type !== Comment) {
          let leavingHooks = resolveTransitionHooks(
            oldInnerChild,
            rawProps,
            state,
            instance
          );
          setTransitionHooks(oldInnerChild, leavingHooks);
          if (mode === "out-in" && innerChild.type !== Comment) {
            state.isLeaving = true;
            leavingHooks.afterLeave = () => {
              state.isLeaving = false;
              if (!(instance.job.flags & 8)) {
                instance.update();
              }
              delete leavingHooks.afterLeave;
              oldInnerChild = void 0;
            };
            return emptyPlaceholder(child);
          } else if (mode === "in-out" && innerChild.type !== Comment) {
            leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
              const leavingVNodesCache = getLeavingNodesForType(
                state,
                oldInnerChild
              );
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
          } else {
            oldInnerChild = void 0;
          }
        } else if (oldInnerChild) {
          oldInnerChild = void 0;
        }
        return child;
      };
    }
  };
  function findNonCommentChild(children) {
    let child = children[0];
    if (children.length > 1) {
      for (const c of children) {
        if (c.type !== Comment) {
          child = c;
          break;
        }
      }
    }
    return child;
  }
  const BaseTransition = BaseTransitionImpl;
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
    const {
      appear,
      mode,
      persisted = false,
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onEnterCancelled,
      onBeforeLeave,
      onLeave,
      onAfterLeave,
      onLeaveCancelled,
      onBeforeAppear,
      onAppear,
      onAfterAppear,
      onAppearCancelled
    } = props;
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook2 = (hook, args) => {
      hook && callWithAsyncErrorHandling(
        hook,
        instance,
        9,
        args
      );
    };
    const callAsyncHook = (hook, args) => {
      const done = args[1];
      callHook2(hook, args);
      if (isArray(hook)) {
        if (hook.every((hook2) => hook2.length <= 1)) done();
      } else if (hook.length <= 1) {
        done();
      }
    };
    const hooks = {
      mode,
      persisted,
      beforeEnter(el) {
        let hook = onBeforeEnter;
        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        }
        if (el[leaveCbKey]) {
          el[leaveCbKey](
            true
            /* cancelled */
          );
        }
        const leavingVNode = leavingVNodesCache[key];
        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
          leavingVNode.el[leaveCbKey]();
        }
        callHook2(hook, [el]);
      },
      enter(el) {
        let hook = onEnter;
        let afterHook = onAfterEnter;
        let cancelHook = onEnterCancelled;
        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }
        let called = false;
        el[enterCbKey] = (cancelled) => {
          if (called) return;
          called = true;
          if (cancelled) {
            callHook2(cancelHook, [el]);
          } else {
            callHook2(afterHook, [el]);
          }
          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }
          el[enterCbKey] = void 0;
        };
        const done = el[enterCbKey].bind(null, false);
        if (hook) {
          callAsyncHook(hook, [el, done]);
        } else {
          done();
        }
      },
      leave(el, remove2) {
        const key2 = String(vnode.key);
        if (el[enterCbKey]) {
          el[enterCbKey](
            true
            /* cancelled */
          );
        }
        if (state.isUnmounting) {
          return remove2();
        }
        callHook2(onBeforeLeave, [el]);
        let called = false;
        el[leaveCbKey] = (cancelled) => {
          if (called) return;
          called = true;
          remove2();
          if (cancelled) {
            callHook2(onLeaveCancelled, [el]);
          } else {
            callHook2(onAfterLeave, [el]);
          }
          el[leaveCbKey] = void 0;
          if (leavingVNodesCache[key2] === vnode) {
            delete leavingVNodesCache[key2];
          }
        };
        const done = el[leaveCbKey].bind(null, false);
        leavingVNodesCache[key2] = vnode;
        if (onLeave) {
          callAsyncHook(onLeave, [el, done]);
        } else {
          done();
        }
      },
      clone(vnode2) {
        const hooks2 = resolveTransitionHooks(
          vnode2,
          props,
          state,
          instance,
          postClone
        );
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
      if (isTeleport(vnode.type) && vnode.children) {
        return findNonCommentChild(vnode.children);
      }
      return vnode;
    }
    if (vnode.component) {
      return vnode.component.subTree;
    }
    const { shapeFlag, children } = vnode;
    if (children) {
      if (shapeFlag & 16) {
        return children[0];
      }
      if (shapeFlag & 32 && isFunction(children.default)) {
        return children.default();
      }
    }
  }
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      vnode.transition = hooks;
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  function getTransitionRawChildren(children, keepComment = false, parentKey) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
      if (child.type === Fragment) {
        if (child.patchFlag & 128) keyedFragmentCount++;
        ret = ret.concat(
          getTransitionRawChildren(child.children, keepComment, key)
        );
      } else if (keepComment || child.type !== Comment) {
        ret.push(key != null ? cloneVNode(child, { key }) : child);
      }
    }
    if (keyedFragmentCount > 1) {
      for (let i = 0; i < ret.length; i++) {
        ret[i].patchFlag = -2;
      }
    }
    return ret;
  }
  // @__NO_SIDE_EFFECTS__
  function defineComponent(options, extraOptions) {
    return isFunction(options) ? (
      // #8236: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
    ) : options;
  }
  function useId$1() {
    const i = getCurrentInstance();
    if (i) {
      return (i.appContext.config.idPrefix || "v") + "-" + i.ids[0] + i.ids[1]++;
    }
    return "";
  }
  function markAsyncBoundary(instance) {
    instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
  }
  function isTemplateRefKey(refs, key) {
    let desc;
    return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
  }
  const pendingSetRefMap = /* @__PURE__ */ new WeakMap();
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray(rawRef)) {
      rawRef.forEach(
        (r, i) => setRef(
          r,
          oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
        setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
      }
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref3 } = rawRef;
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    const rawSetupState = /* @__PURE__ */ toRaw(setupState);
    const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
      if (isTemplateRefKey(refs, key)) {
        return false;
      }
      return hasOwn(rawSetupState, key);
    };
    const canSetRef = (ref22, key) => {
      if (key && isTemplateRefKey(refs, key)) {
        return false;
      }
      return true;
    };
    if (oldRef != null && oldRef !== ref3) {
      invalidatePendingSetRef(oldRawRef);
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (canSetSetupRef(oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (/* @__PURE__ */ isRef(oldRef)) {
        const oldRawRefAtom = oldRawRef;
        if (canSetRef(oldRef, oldRawRefAtom.k)) {
          oldRef.value = null;
        }
        if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
      }
    }
    if (isFunction(ref3)) {
      callWithErrorHandling(ref3, owner, 12, [value, refs]);
    } else {
      const _isString = isString(ref3);
      const _isRef = /* @__PURE__ */ isRef(ref3);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : canSetRef() || !rawRef.k ? ref3.value : refs[rawRef.k];
            if (isUnmount) {
              isArray(existing) && remove(existing, refValue);
            } else {
              if (!isArray(existing)) {
                if (_isString) {
                  refs[ref3] = [refValue];
                  if (canSetSetupRef(ref3)) {
                    setupState[ref3] = refs[ref3];
                  }
                } else {
                  const newVal = [refValue];
                  if (canSetRef(ref3, rawRef.k)) {
                    ref3.value = newVal;
                  }
                  if (rawRef.k) refs[rawRef.k] = newVal;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref3] = value;
            if (canSetSetupRef(ref3)) {
              setupState[ref3] = value;
            }
          } else if (_isRef) {
            if (canSetRef(ref3, rawRef.k)) {
              ref3.value = value;
            }
            if (rawRef.k) refs[rawRef.k] = value;
          } else ;
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
  getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
  getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
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
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(
      type,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
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
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => {
    if (!isInSSRComponentSetup || lifecycle === "sp") {
      injectHook(lifecycle, (...args) => hook(...args), target);
    }
  };
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook(
    "bu"
  );
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook(
    "bum"
  );
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook(
    "sp"
  );
  const onRenderTriggered = createHook("rtg");
  const onRenderTracked = createHook("rtc");
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  const NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache;
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
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(
          needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
          i,
          void 0,
          cached
        );
      }
    } else if (typeof source === "number") {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    } else if (isObject$1(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(
          source,
          (item, i) => renderItem(item, i, void 0, cached)
        );
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached);
        }
      }
    } else {
      ret = [];
    }
    return ret;
  }
  function renderSlot(slots, name, props = {}, fallback, noSlotted) {
    if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
      const hasProps = Object.keys(props).length > 0;
      return openBlock(), createBlock(
        Fragment,
        null,
        [createVNode("slot", props, fallback)],
        hasProps ? -2 : 64
      );
    }
    let slot = slots[name];
    if (slot && slot._c) {
      slot._d = false;
    }
    openBlock();
    const validSlotContent = slot && ensureValidVNode(slot(props));
    const slotKey = props.key || // slot content array of a dynamic conditional slot may have a branch
    // key attached in the `createSlots` helper, respect that
    validSlotContent && validSlotContent.key;
    const rendered = createBlock(
      Fragment,
      {
        key: (slotKey && !isSymbol(slotKey) ? slotKey : `_${name}`) + // #7256 force differentiate fallback content from actual content
        (!validSlotContent && fallback ? "_fb" : "")
      },
      validSlotContent || [],
      validSlotContent && slots._ === 1 ? 64 : -2
    );
    if (rendered.scopeId) {
      rendered.slotScopeIds = [rendered.scopeId + "-s"];
    }
    if (slot && slot._c) {
      slot._d = true;
    }
    return rendered;
  }
  function ensureValidVNode(vnodes) {
    return vnodes.some((child) => {
      if (!isVNode(child)) return true;
      if (child.type === Comment) return false;
      if (child.type === Fragment && !ensureValidVNode(child.children))
        return false;
      return true;
    }) ? vnodes : null;
  }
  const getPublicInstance = (i) => {
    if (!i) return null;
    if (isStatefulComponent(i)) return getComponentPublicInstance(i);
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
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
    })
  );
  const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      if (key === "__v_skip") {
        return true;
      }
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
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
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance.attrs, "get", "");
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else ;
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        return false;
      } else {
        {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({
      _: { data, setupState, accessCache, ctx, appContext, props, type }
    }, key) {
      let cssModules;
      return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  function normalizePropsOrEmits(props) {
    return isArray(props) ? props.reduce(
      (normalized, p2) => (normalized[p2] = null, normalized),
      {}
    ) : props;
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook$1(options.beforeCreate, instance, "bc");
    }
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    const checkDuplicateProperties = null;
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          {
            ctx[key] = methodHandler.bind(publicThis);
          }
        }
      }
    }
    if (dataOptions) {
      const data = dataOptions.call(publicThis, publicThis);
      if (!isObject$1(data)) ;
      else {
        instance.data = /* @__PURE__ */ reactive(data);
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
        const c = computed({
          get,
          set
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c.value,
          set: (v) => c.value = v
        });
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook$1(created, instance, "c");
    }
    function registerLifecycleHook(register, hook) {
      if (isArray(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
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
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render && instance.render === NOOP) {
      instance.render = render;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components) instance.components = components;
    if (directives) instance.directives = directives;
    if (serverPrefetch) {
      markAsyncBoundary(instance);
    }
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
    if (isArray(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject$1(opt)) {
        if ("default" in opt) {
          injected = inject(
            opt.from || key,
            opt.default,
            true
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (/* @__PURE__ */ isRef(injected)) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    }
  }
  function callHook$1(hook, instance, type) {
    callWithAsyncErrorHandling(
      isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
      instance,
      type
    );
  }
  function createWatcher(raw, ctx, publicThis, key) {
    let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      if (isFunction(handler)) {
        {
          watch(getter, handler);
        }
      }
    } else if (isFunction(raw)) {
      {
        watch(getter, raw.bind(publicThis));
      }
    } else if (isObject$1(raw)) {
      if (isArray(raw)) {
        raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
      } else {
        const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction(handler)) {
          watch(getter, handler, raw);
        }
      }
    } else ;
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach(
          (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
        );
      }
      mergeOptions(resolved, base, optionMergeStrategies);
    }
    if (isObject$1(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach(
        (m) => mergeOptions(to, m, strats, true)
      );
    }
    for (const key in from) {
      if (asMixin && key === "expose") ;
      else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
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
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend(
        isFunction(to) ? to.call(this, this) : to,
        isFunction(from) ? from.call(this, this) : from
      );
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
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
      if (isArray(to) && isArray(from)) {
        return [.../* @__PURE__ */ new Set([...to, ...from])];
      }
      return extend(
        /* @__PURE__ */ Object.create(null),
        normalizePropsOrEmits(to),
        normalizePropsOrEmits(from != null ? from : {})
      );
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to) return from;
    if (!from) return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
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
  let uid$1 = 0;
  function createAppAPI(render, hydrate) {
    return function createApp2(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = extend({}, rootComponent);
      }
      if (rootProps != null && !isObject$1(rootProps)) {
        rootProps = null;
      }
      const context2 = createAppContext();
      const installedPlugins = /* @__PURE__ */ new WeakSet();
      const pluginCleanupFns = [];
      let isMounted = false;
      const app = context2.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context2,
        _instance: null,
        version,
        get config() {
          return context2.config;
        },
        set config(v) {
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin)) ;
          else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else ;
          return app;
        },
        mixin(mixin) {
          {
            if (!context2.mixins.includes(mixin)) {
              context2.mixins.push(mixin);
            }
          }
          return app;
        },
        component(name, component) {
          if (!component) {
            return context2.components[name];
          }
          context2.components[name] = component;
          return app;
        },
        directive(name, directive) {
          if (!directive) {
            return context2.directives[name];
          }
          context2.directives[name] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, namespace) {
          if (!isMounted) {
            const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
            vnode.appContext = context2;
            if (namespace === true) {
              namespace = "svg";
            } else if (namespace === false) {
              namespace = void 0;
            }
            {
              render(vnode, rootContainer, namespace);
            }
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            {
              app._instance = vnode.component;
              devtoolsInitApp(app, version);
            }
            return getComponentPublicInstance(vnode.component);
          }
        },
        onUnmount(cleanupFn) {
          pluginCleanupFns.push(cleanupFn);
        },
        unmount() {
          if (isMounted) {
            callWithAsyncErrorHandling(
              pluginCleanupFns,
              app._instance,
              16
            );
            render(null, app._container);
            {
              app._instance = null;
              devtoolsUnmountApp(app);
            }
            delete app._container.__vue_app__;
          }
        },
        provide(key, value) {
          context2.provides[key] = value;
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
  let currentApp = null;
  const getModelModifiers = (props, modelName) => {
    return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
  };
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted) return;
    const props = instance.vnode.props || EMPTY_OBJ;
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
    if (modifiers) {
      if (modifiers.trim) {
        args = rawArgs.map((a) => isString(a) ? a.trim() : a);
      }
      if (modifiers.number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    {
      devtoolsComponentEmit(instance, event, args);
    }
    let handlerName;
    let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener2) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(
        handler,
        instance,
        6,
        args
      );
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  const mixinEmitsCache = /* @__PURE__ */ new WeakMap();
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
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
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject$1(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    if (isObject$1(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  function markAttrsAccessed() {
  }
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit: emit2,
      render,
      renderCache,
      props,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    const prev = setCurrentRenderingInstance(instance);
    let result;
    let fallthroughAttrs;
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        const thisProxy = !!(define_process_env_default.NODE_ENV !== "production") && setupState.__isScriptSetup ? new Proxy(proxyToUse, {
          get(target, key, receiver) {
            warn$1(
              `Property '${String(
                key
              )}' was accessed via 'this'. Avoid using 'this' in templates.`
            );
            return Reflect.get(target, key, receiver);
          }
        }) : proxyToUse;
        result = normalizeVNode(
          render.call(
            thisProxy,
            proxyToUse,
            renderCache,
            !!(define_process_env_default.NODE_ENV !== "production") ? /* @__PURE__ */ shallowReadonly(props) : props,
            setupState,
            data,
            ctx
          )
        );
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if (!!(define_process_env_default.NODE_ENV !== "production") && attrs === props) ;
        result = normalizeVNode(
          render2.length > 1 ? render2(
            !!(define_process_env_default.NODE_ENV !== "production") ? /* @__PURE__ */ shallowReadonly(props) : props,
            !!(define_process_env_default.NODE_ENV !== "production") ? {
              get attrs() {
                markAttrsAccessed();
                return /* @__PURE__ */ shallowReadonly(attrs);
              },
              slots,
              emit: emit2
            } : { attrs, slots, emit: emit2 }
          ) : render2(
            !!(define_process_env_default.NODE_ENV !== "production") ? /* @__PURE__ */ shallowReadonly(props) : props,
            null
          )
        );
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
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(
              fallthroughAttrs,
              propsOptions
            );
          }
          root = cloneVNode(root, fallthroughAttrs, false, true);
        }
      }
    }
    if (vnode.dirs) {
      root = cloneVNode(root, null, false, true);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      setTransitionHooks(root, vnode.transition);
    }
    {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function hasPropValueChanged(nextProps, prevProps, key) {
    const nextProp = nextProps[key];
    const prevProp = prevProps[key];
    if (key === "style" && isObject$1(nextProp) && isObject$1(prevProp)) {
      return !looseEqual(nextProp, prevProp);
    }
    return nextProp !== prevProp;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent) {
      const root = parent.subTree;
      if (root.suspense && root.suspense.activeBranch === vnode) {
        root.el = vnode.el;
      }
      if (root === vnode) {
        (vnode = parent.vnode).el = el;
        parent = parent.parent;
      } else {
        break;
      }
    }
  }
  const internalObjectProto = {};
  const createInternalObject = () => Object.create(internalObjectProto);
  const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = createInternalObject();
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    if (isStateful) {
      instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props,
      attrs,
      vnode: { patchFlag }
    } = instance;
    const rawCurrentProps = /* @__PURE__ */ toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
              );
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance.attrs, "set", "");
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = /* @__PURE__ */ toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !hasOwn(castValues, key)
        );
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
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            const reset = setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props
            );
            reset();
          }
        } else {
          value = defaultValue;
        }
        if (instance.ce) {
          instance.ce._setProp(key, value);
        }
      }
      if (opt[
        0
        /* shouldCast */
      ]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[
          1
          /* shouldCastTrue */
        ] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  const mixinPropsCache = /* @__PURE__ */ new WeakMap();
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = asMixin ? mixinPropsCache : appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
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
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject$1(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray(raw)) {
      for (let i = 0; i < raw.length; i++) {
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
          const propType = prop.type;
          let shouldCast = false;
          let shouldCastTrue = true;
          if (isArray(propType)) {
            for (let index = 0; index < propType.length; ++index) {
              const type = propType[index];
              const typeName = isFunction(type) && type.name;
              if (typeName === "Boolean") {
                shouldCast = true;
                break;
              } else if (typeName === "String") {
                shouldCastTrue = false;
              }
            }
          } else {
            shouldCast = isFunction(propType) && propType.name === "Boolean";
          }
          prop[
            0
            /* shouldCast */
          ] = shouldCast;
          prop[
            1
            /* shouldCastTrue */
          ] = shouldCastTrue;
          if (shouldCast || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    if (isObject$1(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$" && !isReservedProp(key)) {
      return true;
    }
    return false;
  }
  const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
  const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if (!!(define_process_env_default.NODE_ENV !== "production") && currentInstance && !(ctx === null && currentRenderingInstance) && !(ctx && ctx.root !== currentInstance.root)) ;
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key)) continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const assignSlots = (slots, children, optimized) => {
    for (const key in children) {
      if (optimized || !isInternalKey(key)) {
        slots[key] = children[key];
      }
    }
  };
  const initSlots = (instance, children, optimized) => {
    const slots = instance.slots = createInternalObject();
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        assignSlots(slots, children, optimized);
        if (optimized) {
          def(slots, "_", type, true);
        }
      } else {
        normalizeObjectSlots(children, slots);
      }
    } else if (children) {
      normalizeVNodeSlots(instance, children);
    }
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          assignSlots(slots, children, optimized);
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
          delete slots[key];
        }
      }
    }
  };
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    const target = getGlobalThis();
    target.__VUE__ = true;
    {
      setDevtoolsHook$1(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
    }
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref: ref3, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, namespace);
          }
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          break;
        default:
          if (shapeFlag & 1) {
            processElement(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 6) {
            processComponent(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 64) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else if (shapeFlag & 128) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized,
              internals
            );
          } else ;
      }
      if (ref3 != null && parentComponent) {
        setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      } else if (ref3 == null && n1 && n1.ref != null) {
        setRef(n1.ref, null, parentSuspense, n1, true);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateComment(n2.children || ""),
          container,
          anchor
        );
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, namespace) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        namespace,
        n2.el,
        n2.anchor
      );
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
      if (n2.type === "svg") {
        namespace = "svg";
      } else if (n2.type === "math") {
        namespace = "mathml";
      }
      if (n1 == null) {
        mountElement(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
        try {
          if (customElement) {
            customElement._beginPatch();
          }
          patchElement(
            n1,
            n2,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } finally {
          if (customElement) {
            customElement._endPatch();
          }
        }
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(
        vnode.type,
        namespace,
        props && props.is,
        props
      );
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(
          vnode.children,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(vnode, namespace),
          slotScopeIds,
          optimized
        );
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], namespace, parentComponent);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value, namespace);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      {
        def(el, "__vnode", vnode, true);
        def(el, "__vueParentComponent", parentComponent, true);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = needTransition(parentSuspense, transition);
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      {
        el.__vnode = n2;
      }
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
        hostSetElementText(el, "");
      }
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          el,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds
        );
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          el,
          null,
          parentComponent,
          parentSuspense,
          resolveChildrenNamespace(n2, namespace),
          slotScopeIds,
          false
        );
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, oldProps, newProps, parentComponent, namespace);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, namespace);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, namespace, parentComponent);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          true
        );
      }
    };
    const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(
                el,
                key,
                oldProps[key],
                null,
                namespace,
                parentComponent
              );
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key)) continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, namespace, parentComponent);
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(
          // #10007
          // such fragment like `<></>` will be compiled into
          // a fragment which doesn't have a children.
          // In this case fallback to an empty array
          n2.children || [],
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            container,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds
          );
          if (
            // #2080 if the stable fragment has a key, it's a <template v-for> that may
            //  get moved around. Make sure all root level vnodes inherit el.
            // #2134 or if it's a component root, it may also get moved around
            // as the component is being moved.
            n2.key != null || parentComponent && n2 === parentComponent.subTree
          ) {
            traverseStaticChildren(
              n1,
              n2,
              true
              /* shallow */
            );
          }
        } else {
          patchChildren(
            n1,
            n2,
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(
            n2,
            container,
            anchor,
            namespace,
            optimized
          );
        } else {
          mountComponent(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            optimized
          );
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
      const instance = initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      );
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        setupComponent(instance, false, optimized);
      }
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
          initialVNode.placeholder = placeholder.el;
        }
      } else {
        setupRenderEffect(
          instance,
          initialVNode,
          container,
          anchor,
          parentSuspense,
          namespace,
          optimized
        );
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          instance.next = n2;
          instance.update();
        }
      } else {
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
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          {
            if (root.ce && root.ce._hasShadowRoot()) {
              root.ce._injectChildStyle(type);
            }
            const subTree = instance.subTree = renderComponentRoot(instance);
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              namespace
            );
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          {
            devtoolsComponentAdded(instance);
          }
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
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          const nextTree = renderComponentRoot(instance);
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            namespace
          );
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, next, vnode),
              parentSuspense
            );
          }
          {
            devtoolsComponentUpdated(instance);
          }
        }
      };
      instance.scope.on();
      const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
      instance.scope.off();
      const update = instance.update = effect2.run.bind(effect2);
      const job = instance.job = effect2.runIfDirty.bind(effect2);
      job.i = instance;
      job.id = instance.uid;
      effect2.scheduler = () => queueJob(job);
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
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          }
        }
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
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
      if (oldLength > newLength) {
        unmountChildren(
          c1,
          parentComponent,
          parentSuspense,
          true,
          false,
          commonLength
        );
      } else {
        mountChildren(
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized,
          commonLength
        );
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            keyToNewIndexMap.set(nextChild.key, i);
          }
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
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(
              prevChild,
              c2[newIndex],
              container,
              null,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchorVNode = c2[nextIndex + 1];
          const anchor = nextIndex + 1 < l2 ? (
            // #13559, #14173 fallback to el placeholder for unresolved async component
            anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode)
          ) : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(
              null,
              nextChild,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              namespace,
              slotScopeIds,
              optimized
            );
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
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
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition2) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove22 = () => {
            if (vnode.ctx.isUnmounted) {
              hostRemove(el);
            } else {
              hostInsert(el, container, anchor);
            }
          };
          const performLeave = () => {
            if (el._isLeaving) {
              el[leaveCbKey](
                true
                /* cancelled */
              );
            }
            leave(el, () => {
              remove22();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove22, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const {
        type,
        props,
        ref: ref3,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs,
        cacheIndex
      } = vnode;
      if (patchFlag === -2) {
        optimized = false;
      }
      if (ref3 != null) {
        pauseTracking();
        setRef(ref3, null, parentSuspense, vnode, true);
        resetTracking();
      }
      if (cacheIndex != null) {
        parentComponent.renderCache[cacheIndex] = void 0;
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(
            vnode,
            parentComponent,
            parentSuspense,
            internals,
            doRemove
          );
        } else if (dynamicChildren && // #5154
        // when v-once is used inside a block, setBlockTracking(-1) marks the
        // parent block with hasOnce: true
        // so that it doesn't take the fast path during unmount - otherwise
        // components nested in v-once are never unmounted.
        !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(
            dynamicChildren,
            parentComponent,
            parentSuspense,
            false,
            true
          );
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
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
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (job) {
        job.flags |= 8;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      {
        devtoolsComponentRemoved(instance);
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
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
      } else {
        patch(
          container._vnode || null,
          vnode,
          container,
          null,
          null,
          null,
          namespace
        );
      }
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
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    return {
      render,
      hydrate,
      createApp: createAppAPI(render)
    };
  }
  function resolveChildrenNamespace({ type, props }, currentNamespace) {
    return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
  }
  function toggleRecurse({ effect: effect2, job }, allowed) {
    if (allowed) {
      effect2.flags |= 32;
      job.flags |= 4;
    } else {
      effect2.flags &= -33;
      job.flags &= -5;
    }
  }
  function needTransition(parentSuspense, transition) {
    return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray(ch1) && isArray(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow && c2.patchFlag !== -2)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text) {
          if (c2.patchFlag === -1) {
            c2 = ch2[i] = cloneIfMounted(c2);
          }
          c2.el = c1.el;
        }
        if (c2.type === Comment && !c2.el) {
          c2.el = c1.el;
        }
      }
    }
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p2[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p2[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p2[v];
    }
    return result;
  }
  function locateNonHydratedAsyncRoot(instance) {
    const subComponent = instance.subTree.component;
    if (subComponent) {
      if (subComponent.asyncDep && !subComponent.asyncResolved) {
        return subComponent;
      } else {
        return locateNonHydratedAsyncRoot(subComponent);
      }
    }
  }
  function invalidateMount(hooks) {
    if (hooks) {
      for (let i = 0; i < hooks.length; i++)
        hooks[i].flags |= 8;
    }
  }
  function resolveAsyncComponentPlaceholder(anchorVnode) {
    if (anchorVnode.placeholder) {
      return anchorVnode.placeholder;
    }
    const instance = anchorVnode.component;
    if (instance) {
      return resolveAsyncComponentPlaceholder(instance.subTree);
    }
    return null;
  }
  const isSuspense = (type) => type.__isSuspense;
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  const Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
  const Text = /* @__PURE__ */ Symbol.for("v-txt");
  const Comment = /* @__PURE__ */ Symbol.for("v-cmt");
  const Static = /* @__PURE__ */ Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value, inVOnce = false) {
    isBlockTreeEnabled += value;
    if (value < 0 && currentBlock && inVOnce) {
      currentBlock.hasOnce = true;
    }
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        true
      )
    );
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        true
      )
    );
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({
    ref: ref3,
    ref_key,
    ref_for
  }) => {
    if (typeof ref3 === "number") {
      ref3 = "" + ref3;
    }
    return ref3 != null ? isString(ref3) || /* @__PURE__ */ isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
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
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = _createVNode;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(
        type,
        props,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag = -2;
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject$1(style)) {
        if (/* @__PURE__ */ isProxy(style) && !isArray(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction(type) ? 2 : 0;
    return createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      true
    );
  }
  function guardReactiveProps(props) {
    if (!props) return null;
    return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
    const { props, ref: ref3, patchFlag, children, transition } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref3,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children,
      target: vnode.target,
      targetStart: vnode.targetStart,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
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
    if (transition && cloneTransition) {
      setTransitionHooks(
        cloned,
        transition.clone(cloned)
      );
    }
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
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (isVNode(child)) {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
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
        if (!slotFlag && !isInternalObject(children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  const emptyAppContext = createAppContext();
  let uid = 0;
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
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      job: null,
      scope: new EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      ids: parent ? parent.ids : ["", 0, 0],
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
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
    {
      instance.ctx = { _: instance };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  let internalSetCurrentInstance;
  let setInSSRSetupState;
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
    internalSetCurrentInstance = registerGlobalSetter(
      `__VUE_INSTANCE_SETTERS__`,
      (v) => currentInstance = v
    );
    setInSSRSetupState = registerGlobalSetter(
      `__VUE_SSR_SETTERS__`,
      (v) => isInSSRComponentSetup = v
    );
  }
  const setCurrentInstance = (instance) => {
    const prev = currentInstance;
    internalSetCurrentInstance(instance);
    instance.scope.on();
    return () => {
      instance.scope.off();
      internalSetCurrentInstance(prev);
    };
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
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
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [
          instance.props,
          setupContext
        ]
      );
      const isAsyncSetup = isPromise(setupResult);
      resetTracking();
      reset();
      if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
        markAsyncBoundary(instance);
      }
      if (isAsyncSetup) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
        }
      } else {
        handleSetupResult(instance, setupResult);
      }
    } else {
      finishComponentSetup(instance);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject$1(setupResult)) {
      {
        instance.devtoolsRawSetupState = setupResult;
      }
      instance.setupState = proxyRefs(setupResult);
    } else ;
    finishComponentSetup(instance);
  }
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      instance.render = Component.render || NOOP;
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
  const attrsProxyHandlers = {
    get(target, key) {
      track(target, "get", "");
      return target[key];
    }
  };
  function createSetupContext(instance) {
    const expose = (exposed) => {
      instance.exposed = exposed || {};
    };
    {
      return {
        attrs: new Proxy(instance.attrs, attrsProxyHandlers),
        slots: instance.slots,
        emit: instance.emit,
        expose
      };
    }
  }
  function getComponentPublicInstance(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    } else {
      return instance.proxy;
    }
  }
  const classifyRE = /(?:^|[-_])\w/g;
  const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(
        instance.parent.type.components
      ) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    const c = /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
    return c;
  };
  function h(type, propsOrChildren, children) {
    try {
      setBlockTracking(-1);
      const l = arguments.length;
      if (l === 2) {
        if (isObject$1(propsOrChildren) && !isArray(propsOrChildren)) {
          if (isVNode(propsOrChildren)) {
            return createVNode(type, null, [propsOrChildren]);
          }
          return createVNode(type, propsOrChildren);
        } else {
          return createVNode(type, null, propsOrChildren);
        }
      } else {
        if (l > 3) {
          children = Array.prototype.slice.call(arguments, 2);
        } else if (l === 3 && isVNode(children)) {
          children = [children];
        }
        return createVNode(type, propsOrChildren, children);
      }
    } finally {
      setBlockTracking(1);
    }
  }
  const version = "3.5.28";
  let policy = void 0;
  const tt = typeof window !== "undefined" && window.trustedTypes;
  if (tt) {
    try {
      policy = /* @__PURE__ */ tt.createPolicy("vue", {
        createHTML: (val) => val
      });
    } catch (e) {
    }
  }
  const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
  const svgNS = "http://www.w3.org/2000/svg";
  const mathmlNS = "http://www.w3.org/1998/Math/MathML";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, namespace, is, props) => {
      const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
      if (tag === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
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
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, namespace, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end || !(start = start.nextSibling)) break;
        }
      } else {
        templateContainer.innerHTML = unsafeToTrustedHTML(
          namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
        );
        const template = templateContainer.content;
        if (namespace === "svg" || namespace === "mathml") {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };
  const TRANSITION = "transition";
  const ANIMATION = "animation";
  const vtcKey = /* @__PURE__ */ Symbol("_vtc");
  const DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: true
    },
    duration: [String, Number, Object],
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
  const TransitionPropsValidators = /* @__PURE__ */ extend(
    {},
    BaseTransitionPropsValidators,
    DOMTransitionPropsValidators
  );
  const decorate$1 = (t) => {
    t.displayName = "Transition";
    t.props = TransitionPropsValidators;
    return t;
  };
  const Transition = /* @__PURE__ */ decorate$1(
    (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots)
  );
  const callHook = (hook, args = []) => {
    if (isArray(hook)) {
      hook.forEach((h2) => h2(...args));
    } else if (hook) {
      hook(...args);
    }
  };
  const hasExplicitCallback = (hook) => {
    return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
  };
  function resolveTransitionProps(rawProps) {
    const baseProps = {};
    for (const key in rawProps) {
      if (!(key in DOMTransitionPropsValidators)) {
        baseProps[key] = rawProps[key];
      }
    }
    if (rawProps.css === false) {
      return baseProps;
    }
    const {
      name = "v",
      type,
      duration,
      enterFromClass = `${name}-enter-from`,
      enterActiveClass = `${name}-enter-active`,
      enterToClass = `${name}-enter-to`,
      appearFromClass = enterFromClass,
      appearActiveClass = enterActiveClass,
      appearToClass = enterToClass,
      leaveFromClass = `${name}-leave-from`,
      leaveActiveClass = `${name}-leave-active`,
      leaveToClass = `${name}-leave-to`
    } = rawProps;
    const durations = normalizeDuration(duration);
    const enterDuration = durations && durations[0];
    const leaveDuration = durations && durations[1];
    const {
      onBeforeEnter,
      onEnter,
      onEnterCancelled,
      onLeave,
      onLeaveCancelled,
      onBeforeAppear = onBeforeEnter,
      onAppear = onEnter,
      onAppearCancelled = onEnterCancelled
    } = baseProps;
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
          if (!hasExplicitCallback(hook)) {
            whenTransitionEnds(el, type, enterDuration, resolve);
          }
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
          if (!el._isLeaving) {
            return;
          }
          removeTransitionClass(el, leaveFromClass);
          addTransitionClass(el, leaveToClass);
          if (!hasExplicitCallback(onLeave)) {
            whenTransitionEnds(el, type, leaveDuration, resolve);
          }
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
    if (duration == null) {
      return null;
    } else if (isObject$1(duration)) {
      return [NumberOf(duration.enter), NumberOf(duration.leave)];
    } else {
      const n = NumberOf(duration);
      return [n, n];
    }
  }
  function NumberOf(val) {
    const res = toNumber(val);
    return res;
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
      if (!_vtc.size) {
        el[vtcKey] = void 0;
      }
    }
  }
  function nextFrame(cb) {
    requestAnimationFrame(() => {
      requestAnimationFrame(cb);
    });
  }
  let endId = 0;
  function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
    const id = el._endId = ++endId;
    const resolveIfNotStale = () => {
      if (id === el._endId) {
        resolve();
      }
    };
    if (explicitTimeout != null) {
      return setTimeout(resolveIfNotStale, explicitTimeout);
    }
    const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
    if (!type) {
      return resolve();
    }
    const endEvent = type + "end";
    let ended = 0;
    const end = () => {
      el.removeEventListener(endEvent, onEnd);
      resolveIfNotStale();
    };
    const onEnd = (e) => {
      if (e.target === el && ++ended >= propCount) {
        end();
      }
    };
    setTimeout(() => {
      if (ended < propCount) {
        end();
      }
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
    const hasTransform = type === TRANSITION && /\b(?:transform|all)(?:,|$)/.test(
      getStyleProperties(`${TRANSITION}Property`).toString()
    );
    return {
      type,
      timeout,
      propCount,
      hasTransform
    };
  }
  function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }
    return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
  }
  function toMs(s) {
    if (s === "auto") return 0;
    return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
  }
  function forceReflow(el) {
    const targetDocument = el ? el.ownerDocument : document;
    return targetDocument.body.offsetHeight;
  }
  function patchClass(el, value, isSVG) {
    const transitionClasses = el[vtcKey];
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }
  const vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
  const vShowHidden = /* @__PURE__ */ Symbol("_vsh");
  const CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
  const displayRE = /(?:^|;)\s*display\s*:/;
  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString(next);
    let hasControlledDisplay = false;
    if (next && !isCssString) {
      if (prev) {
        if (!isString(prev)) {
          for (const key in prev) {
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        } else {
          for (const prevStyle of prev.split(";")) {
            const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
            if (next[key] == null) {
              setStyle(style, key, "");
            }
          }
        }
      }
      for (const key in next) {
        if (key === "display") {
          hasControlledDisplay = true;
        }
        setStyle(style, key, next[key]);
      }
    } else {
      if (isCssString) {
        if (prev !== next) {
          const cssVarText = style[CSS_VAR_TEXT];
          if (cssVarText) {
            next += ";" + cssVarText;
          }
          style.cssText = next;
          hasControlledDisplay = displayRE.test(next);
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
    }
    if (vShowOriginalDisplay in el) {
      el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
      if (el[vShowHidden]) {
        style.display = "none";
      }
    }
  }
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
    if (isArray(val)) {
      val.forEach((v) => setStyle(style, name, v));
    } else {
      if (val == null) val = "";
      if (name.startsWith("--")) {
        style.setProperty(name, val);
      } else {
        const prefixed = autoPrefix(style, name);
        if (importantRE.test(val)) {
          style.setProperty(
            hyphenate(prefixed),
            val.replace(importantRE, ""),
            "important"
          );
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name = camelize(rawName);
    if (name !== "filter" && name in style) {
      return prefixCache[rawName] = name;
    }
    name = capitalize(name);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (value == null || isBoolean && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(
          key,
          isBoolean ? "" : isSymbol(value) ? String(value) : value
        );
      }
    }
  }
  function patchDOMProp(el, key, value, parentComponent, attrName) {
    if (key === "innerHTML" || key === "textContent") {
      if (value != null) {
        el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
      }
      return;
    }
    const tag = el.tagName;
    if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
    !tag.includes("-")) {
      const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
      const newValue = value == null ? (
        // #11647: value should be set as empty string for null and undefined,
        // but <input type="checkbox"> should be set as 'on'.
        el.type === "checkbox" ? "on" : ""
      ) : String(value);
      if (oldValue !== newValue || !("_value" in el)) {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      el._value = value;
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type = typeof el[key];
      if (type === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type === "string") {
        value = "";
        needRemove = true;
      } else if (type === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
    }
    needRemove && el.removeAttribute(attrName || key);
  }
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  const veiKey = /* @__PURE__ */ Symbol("_vei");
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el[veiKey] || (el[veiKey] = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
      const [name, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(
          nextValue,
          instance
        );
        addEventListener(el, name, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
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
    const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
    return [event, options];
  }
  let cachedNow = 0;
  const p = /* @__PURE__ */ Promise.resolve();
  const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      if (!e._vts) {
        e._vts = Date.now();
      } else if (e._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(
        patchStopImmediatePropagation(e, invoker.value),
        instance,
        5,
        [e]
      );
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
      return value.map(
        (fn) => (e2) => !e2._stopped && fn && fn(e2)
      );
    } else {
      return value;
    }
  }
  const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
  key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
  const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
    const isSVG = namespace === "svg";
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(el, key, nextValue);
      if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
        patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
      }
    } else if (
      // #11081 force set props for possible async custom element
      el._isVueCE && (/[A-Z]/.test(key) || !isString(nextValue))
    ) {
      patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && isNativeOn(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
      return false;
    }
    if (key === "sandbox" && el.tagName === "IFRAME") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (key === "width" || key === "height") {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
        return false;
      }
    }
    if (isNativeOn(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  const getModelAssigner = (vnode) => {
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
  const assignKey = /* @__PURE__ */ Symbol("_assign");
  function castValue(value, trim, number) {
    if (trim) value = value.trim();
    if (number) value = looseToNumber(value);
    return value;
  }
  const vModelText = {
    created(el, { modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      const castToNumber = number || vnode.props && vnode.props.type === "number";
      addEventListener(el, lazy ? "change" : "input", (e) => {
        if (e.target.composing) return;
        el[assignKey](castValue(el.value, trim, castToNumber));
      });
      if (trim || castToNumber) {
        addEventListener(el, "change", () => {
          el.value = castValue(el.value, trim, castToNumber);
        });
      }
      if (!lazy) {
        addEventListener(el, "compositionstart", onCompositionStart);
        addEventListener(el, "compositionend", onCompositionEnd);
        addEventListener(el, "change", onCompositionEnd);
      }
    },
    // set value on mounted so it's after min/max for type="range"
    mounted(el, { value }) {
      el.value = value == null ? "" : value;
    },
    beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      if (el.composing) return;
      const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber(el.value) : el.value;
      const newValue = value == null ? "" : value;
      if (elValue === newValue) {
        return;
      }
      if (document.activeElement === el && el.type !== "range") {
        if (lazy && value === oldValue) {
          return;
        }
        if (trim && el.value.trim() === newValue) {
          return;
        }
      }
      el.value = newValue;
    }
  };
  const vModelCheckbox = {
    // #4096 array checkboxes need to be deep traversed
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
          if (checked && !found) {
            assign(modelValue.concat(elementValue));
          } else if (!checked && found) {
            const filtered = [...modelValue];
            filtered.splice(index, 1);
            assign(filtered);
          }
        } else if (isSet(modelValue)) {
          const cloned = new Set(modelValue);
          if (checked) {
            cloned.add(elementValue);
          } else {
            cloned.delete(elementValue);
          }
          assign(cloned);
        } else {
          assign(getCheckboxValue(el, checked));
        }
      });
    },
    // set initial checked on mount to wait for true-value/false-value
    mounted: setChecked,
    beforeUpdate(el, binding, vnode) {
      el[assignKey] = getModelAssigner(vnode);
      setChecked(el, binding, vnode);
    }
  };
  function setChecked(el, { value, oldValue }, vnode) {
    el._modelValue = value;
    let checked;
    if (isArray(value)) {
      checked = looseIndexOf(value, vnode.props.value) > -1;
    } else if (isSet(value)) {
      checked = value.has(vnode.props.value);
    } else {
      if (value === oldValue) return;
      checked = looseEqual(value, getCheckboxValue(el, true));
    }
    if (el.checked !== checked) {
      el.checked = checked;
    }
  }
  function getValue(el) {
    return "_value" in el ? el._value : el.value;
  }
  function getCheckboxValue(el, checked) {
    const key = checked ? "_trueValue" : "_falseValue";
    return key in el ? el[key] : checked;
  }
  const systemModifiers = ["ctrl", "shift", "alt", "meta"];
  const modifierGuards = {
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
  const withModifiers = (fn, modifiers) => {
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
  const keyNames = {
    esc: "escape",
    space: " ",
    up: "arrow-up",
    left: "arrow-left",
    right: "arrow-right",
    down: "arrow-down",
    delete: "backspace"
  };
  const withKeys = (fn, modifiers) => {
    const cache = fn._withKeys || (fn._withKeys = {});
    const cacheKey = modifiers.join(".");
    return cache[cacheKey] || (cache[cacheKey] = ((event) => {
      if (!("key" in event)) {
        return;
      }
      const eventKey = hyphenate(event.key);
      if (modifiers.some(
        (k) => k === eventKey || keyNames[k] === eventKey
      )) {
        return fn(event);
      }
    }));
  };
  const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
  let renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  const createApp = ((...args) => {
    const app = ensureRenderer().createApp(...args);
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container) return;
      const component = app._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      if (container.nodeType === 1) {
        container.textContent = "";
      }
      const proxy = mount(container, false, resolveRootNamespace(container));
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app;
  });
  function resolveRootNamespace(container) {
    if (container instanceof SVGElement) {
      return "svg";
    }
    if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
      return "mathml";
    }
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      return res;
    }
    return container;
  }
  function tryOnScopeDispose(fn, failSilently) {
    if (getCurrentScope()) {
      onScopeDispose(fn, failSilently);
      return true;
    }
    return false;
  }
  // @__NO_SIDE_EFFECTS__
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
  const isClient = typeof window !== "undefined" && typeof document !== "undefined";
  typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
  const isDef = (val) => typeof val !== "undefined";
  const toString = Object.prototype.toString;
  const isObject = (val) => toString.call(val) === "[object Object]";
  const noop = () => {
  };
  const isIOS = /* @__PURE__ */ getIsIOS();
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
  const bypassFilter = (invoke$1) => {
    return invoke$1();
  };
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
  function getLifeCycleTarget(target) {
    return getCurrentInstance();
  }
  // @__NO_SIDE_EFFECTS__
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
  // @__NO_SIDE_EFFECTS__
  function useDebounceFn(fn, ms = 200, options = {}) {
    return createFilterWrapper(debounceFilter(ms, options), fn);
  }
  function watchWithFilter(source, cb, options = {}) {
    const { eventFilter = bypassFilter, ...watchOptions } = options;
    return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
  }
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
  function tryOnBeforeUnmount(fn, target) {
    if (getLifeCycleTarget()) onBeforeUnmount(fn, target);
  }
  function tryOnMounted(fn, sync = true, target) {
    if (getLifeCycleTarget()) onMounted(fn, target);
    else if (sync) fn();
    else nextTick(fn);
  }
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
  function watchImmediate(source, cb, options) {
    return watch(source, cb, {
      ...options,
      immediate: true
    });
  }
  const defaultWindow = isClient ? window : void 0;
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
  // @__NO_SIDE_EFFECTS__
  function useMounted() {
    const isMounted = /* @__PURE__ */ shallowRef(false);
    const instance = getCurrentInstance();
    if (instance) onMounted(() => {
      isMounted.value = true;
    }, instance);
    return isMounted;
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
  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  const handlers = /* @__PURE__ */ getHandlers();
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
  const StorageSerializers = {
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
  const customStorageEventName = "vueuse-storage";
  function useStorage(key, defaults$1, storage, options = {}) {
    var _options$serializer;
    const { flush = "pre", deep = true, listenToStorageChanges = true, writeDefaults = true, mergeDefaults = false, shallow, window: window$1 = defaultWindow, eventFilter, onError = (e) => {
      console.error(e);
    }, initOnMounted } = options;
    const data = (shallow ? shallowRef : ref)(defaults$1);
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
  // @__NO_SIDE_EFFECTS__
  function useVModel(props, key, emit2, options = {}) {
    var _vm$$emit, _vm$proxy;
    const { clone = false, passive = false, eventName, deep = false, defaultValue, shouldEmit } = options;
    const vm = getCurrentInstance();
    const _emit = emit2 || (vm === null || vm === void 0 ? void 0 : vm.emit) || (vm === null || vm === void 0 || (_vm$$emit = vm.$emit) === null || _vm$$emit === void 0 ? void 0 : _vm$$emit.bind(vm)) || (vm === null || vm === void 0 || (_vm$proxy = vm.proxy) === null || _vm$proxy === void 0 || (_vm$proxy = _vm$proxy.$emit) === null || _vm$proxy === void 0 ? void 0 : _vm$proxy.bind(vm === null || vm === void 0 ? void 0 : vm.proxy));
    let event = eventName;
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
  const useGlobalState = /* @__PURE__ */ createGlobalState(() => {
    const csrfToken = /* @__PURE__ */ ref(null);
    const cpTrigger = /* @__PURE__ */ ref(null);
    const sites = /* @__PURE__ */ ref([]);
    const primarySiteId2 = /* @__PURE__ */ ref(1);
    const hasSelectedVolumes = /* @__PURE__ */ ref(true);
    return { csrfToken, cpTrigger, sites, primarySiteId: primarySiteId2, hasSelectedVolumes };
  });
  class ApiError extends Error {
    status;
    payload;
    constructor(message, status, payload = null) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.payload = payload;
    }
  }
  const isPlainObject$1 = (value) => Object.prototype.toString.call(value) === "[object Object]";
  const isErrorEnvelope = (payload) => isPlainObject$1(payload) && payload.status === "error" && typeof payload.message === "string";
  const isSuccessEnvelope = (payload) => isPlainObject$1(payload) && payload.status === "success" && "data" in payload;
  const getCsrfToken = () => {
    try {
      const { csrfToken } = useGlobalState();
      return csrfToken.value;
    } catch {
      return null;
    }
  };
  const appendCsrf = (body, includeCsrf) => {
    const token = includeCsrf ? getCsrfToken() : null;
    if (!includeCsrf || !token) {
      return body;
    }
    if (body instanceof FormData) {
      body.append(token.name, token.value);
      return body;
    }
    if (isPlainObject$1(body)) {
      return {
        ...body,
        [token.name]: token.value
      };
    }
    return body;
  };
  async function request(url, options = {}) {
    const headers = new Headers({ Accept: "application/json" });
    if (options.headers) {
      new Headers(options.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }
    const shouldIncludeCsrf = options.includeCsrf ?? true;
    let body = appendCsrf(options.body, shouldIncludeCsrf);
    if (isPlainObject$1(body)) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      body = JSON.stringify(body);
    }
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body,
      signal: options.signal
    });
    const contentType = response.headers.get("Content-Type") ?? "";
    const payload = contentType.includes("application/json") ? await response.json() : await response.text();
    if (!response.ok) {
      const message = (isPlainObject$1(payload) && typeof payload.message === "string" ? payload.message : response.statusText) || "Request failed";
      throw new ApiError(message, response.status, payload);
    }
    if (isErrorEnvelope(payload)) {
      throw new ApiError(payload.message, response.status, payload);
    }
    if (isSuccessEnvelope(payload)) {
      return {
        data: payload.data,
        message: payload.message ?? null
      };
    }
    return {
      data: payload,
      message: null
    };
  }
  const apiClient = {
    get(url, options = {}) {
      return request(url, { ...options, method: "GET" });
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
  const useAssetsState = /* @__PURE__ */ createGlobalState(() => {
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
      if (typeof limit === "number") {
        defaultLimit.value = limit;
      }
      if (typeof offset === "number") {
        defaultOffset.value = offset;
      }
      if (typeof sort === "string") {
        defaultSort.value = sort;
      }
      if (typeof query === "string") {
        defaultQuery.value = query;
      }
      if (typeof filter === "string") {
        defaultFilter.value = filter;
      }
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
        const { data } = await apiClient.get(
          `/actions/altpilot/web/get-all-assets?limit=${limit}&offset=${offset}&sort=${sort}&filter=${filter}&query=${encodeURIComponent(
            query
          )}&siteId=all`
        );
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
      if (siteId == null) {
        return;
      }
      if (!assets.value[assetId]) {
        return;
      }
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
    if (options) {
      state.setDefaults(
        options.defaultLimit,
        options.defaultOffset,
        options.defaultSort,
        options.defaultQuery,
        options.defaultFilter
      );
    }
    return state;
  }
  const STATUS_LABELS = {
    0: "Missing alt text",
    1: "AI-generated",
    2: "Manual"
  };
  const DEFAULT_STATUS_ORDER = [0, 1, 2];
  const useStatusCountsState = /* @__PURE__ */ createGlobalState(() => {
    const statusCounts = /* @__PURE__ */ ref(
      DEFAULT_STATUS_ORDER.reduce((acc, code) => {
        acc[code] = 0;
        return acc;
      }, {})
    );
    const total = /* @__PURE__ */ ref(0);
    const loading = /* @__PURE__ */ ref(false);
    const error = /* @__PURE__ */ ref(null);
    const fetchStatusCounts = async () => {
      loading.value = true;
      error.value = null;
      try {
        const { data } = await apiClient.get(
          "/actions/altpilot/web/get-status-counts"
        );
        const countsPayloadEntries = Object.entries(data.counts ?? {}).reduce(
          (acc, [status, count]) => {
            acc[status] = Number(count);
            return acc;
          },
          {}
        );
        statusCounts.value = DEFAULT_STATUS_ORDER.reduce((acc, code) => {
          acc[code] = countsPayloadEntries[String(code)] ?? 0;
          return acc;
        }, {});
        total.value = typeof data.total === "number" ? data.total : DEFAULT_STATUS_ORDER.reduce(
          (sum, code) => sum + (statusCounts.value[code] ?? 0),
          0
        );
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
    const statusCountItems = computed(
      () => DEFAULT_STATUS_ORDER.map((code) => ({
        code,
        label: STATUS_LABELS[code] ?? `Status ${code}`,
        count: statusCounts.value[code] ?? 0
      }))
    );
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
  const useStatusCounts = () => useStatusCountsState();
  const createId = () => {
    try {
      return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    } catch {
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
  };
  const useToasts = /* @__PURE__ */ createGlobalState(() => {
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
    function remove2(id) {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }
    function onOpenChange(id, open) {
      if (open) return;
      window.setTimeout(() => remove2(id), 150);
    }
    return {
      toasts,
      maxToasts,
      toast,
      dismiss,
      remove: remove2,
      onOpenChange
    };
  });
  const { primarySiteId } = useGlobalState();
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
      const currentValue = (altTexts[siteId] ?? "").trim();
      const originalValue = (originalAltTexts[siteId] ?? "").trim();
      return currentValue !== originalValue;
    };
    watch(
      () => {
        const currentAlts = {};
        Object.values(asset).forEach((localized) => {
          currentAlts[localized.siteId] = localized.alt ?? "";
        });
        return currentAlts;
      },
      (newAlts, oldAlts) => {
        Object.entries(newAlts).forEach(([siteIdStr, newAlt]) => {
          const siteId = Number(siteIdStr);
          const oldAlt = oldAlts?.[siteId] ?? "";
          if (newAlt !== oldAlt) {
            altTexts[siteId] = newAlt;
            originalAltTexts[siteId] = newAlt;
          }
        });
      },
      { deep: true }
    );
    const hasChanges = computed(() => {
      const keys = /* @__PURE__ */ new Set([...Object.keys(originalAltTexts), ...Object.keys(altTexts)]);
      for (const key of keys) {
        const siteId = Number(key);
        if (isSiteChanged(siteId)) {
          return true;
        }
      }
      return false;
    });
    const hasSiteChanges = (siteId) => {
      return isSiteChanged(siteId);
    };
    const resetChanges = () => {
      const keys = /* @__PURE__ */ new Set([...Object.keys(originalAltTexts), ...Object.keys(altTexts)]);
      for (const key of keys) {
        const siteId = Number(key);
        altTexts[siteId] = originalAltTexts[siteId] ?? "";
      }
      error.value = null;
      successMessage.value = null;
    };
    const getChangedAltTexts = () => {
      const changed = {};
      const keys = /* @__PURE__ */ new Set([...Object.keys(originalAltTexts), ...Object.keys(altTexts)]);
      keys.forEach((key) => {
        const siteId = Number(key);
        if (isSiteChanged(siteId)) {
          changed[siteId] = (altTexts[siteId] ?? "").trim();
        }
      });
      return changed;
    };
    const save = async () => {
      if (!hasChanges.value || saving.value) {
        return;
      }
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
        if (!data) {
          throw new Error("Failed to save alt texts");
        }
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
  const ASSET_KEY_SEPARATOR = ":";
  const makeKey = (assetId, siteId) => `${assetId}${ASSET_KEY_SEPARATOR}${siteId ?? "default"}`;
  const ACTIVE_STATUSES = ["waiting", "running"];
  const queuePollInterval = 1e3;
  const getErrorMessageForFailedJob = (item) => {
    if (item.error?.message) {
      return item.error.message;
    }
    return item.message ?? "Generation failed";
  };
  const useGenerationTracker = /* @__PURE__ */ createGlobalState(() => {
    const trackedAssets = /* @__PURE__ */ reactive(/* @__PURE__ */ new Map());
    const lastError = /* @__PURE__ */ ref(null);
    const { csrfToken } = useGlobalState();
    const { replaceAsset } = useAssets();
    const { fetchStatusCounts } = useStatusCounts();
    const { toast } = useToasts();
    const pollQueue = async () => {
      if (!csrfToken.value) {
        return;
      }
      const activeEntries = Array.from(trackedAssets.values()).filter(
        (entry) => ACTIVE_STATUSES.includes(entry.status)
      );
      if (activeEntries.length === 0) {
        return;
      }
      const payload = {
        assets: activeEntries.map((entry) => ({
          assetId: entry.assetId,
          siteId: entry.siteId,
          jobId: entry.jobId
        })),
        [csrfToken.value.name]: csrfToken.value.value
      };
      try {
        const { data } = await apiClient.postJson(
          "/actions/altpilot/web/job-status",
          payload
        );
        const assets = data?.assets ?? [];
        assets.forEach((item) => {
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
            } else {
              trackedAssets.set(key, {
                assetId: item.assetId,
                siteId: item.siteId ?? null,
                jobId: item.jobId ?? null,
                status: "finished",
                message
              });
            }
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
              // technically an error, but reka-ui only has foreground/background
            });
            if (existing) {
              existing.status = "missing";
              existing.message = message;
            } else {
              trackedAssets.set(key, {
                assetId: item.assetId,
                siteId: item.siteId ?? null,
                jobId: item.jobId ?? null,
                status: "missing",
                message
              });
            }
            setTimeout(() => {
              trackedAssets.delete(key);
            }, 2500);
            return;
          }
          if (item.status === "failed") {
            const errorMessage = getErrorMessageForFailedJob(item);
            toast({
              title: "Error",
              description: errorMessage,
              type: "foreground"
            });
          }
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
          if (!ACTIVE_STATUSES.includes(existing.status)) {
            setTimeout(() => {
              trackedAssets.delete(key);
            }, 2e3);
          }
        });
        lastError.value = null;
      } catch (err) {
        lastError.value = err instanceof Error ? err.message : "Unknown error";
      }
    };
    const { pause, resume } = useIntervalFn(pollQueue, queuePollInterval, { immediate: false });
    watch(
      () => trackedAssets.size,
      (size) => {
        if (size > 0) {
          resume();
        } else {
          pause();
        }
      },
      { immediate: true }
    );
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
  const HIDDEN_IFRAME_REMOVE_DELAY = 1e3;
  function useAssetGeneration(asset) {
    const { csrfToken, cpTrigger } = useGlobalState();
    const { trackAsset, stateForAsset, isAssetRunning } = useGenerationTracker();
    const { toast } = useToasts();
    const generatingBySite = /* @__PURE__ */ reactive({});
    const errorBySite = /* @__PURE__ */ reactive({});
    const successBySite = /* @__PURE__ */ reactive({});
    const triggerQueueRunner = () => {
      if (!cpTrigger.value) {
        return;
      }
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.src = `/${cpTrigger.value}`;
      document.body.appendChild(iframe);
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
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
      if (generatingBySite[siteId]) {
        return;
      }
      generatingBySite[siteId] = true;
      errorBySite[siteId] = null;
      successBySite[siteId] = null;
      try {
        const payload = {
          assetID: asset[siteId].id.toString(),
          siteId: siteId.toString()
        };
        const { data, message } = await apiClient.postJson(
          "/actions/altpilot/web/queue",
          payload
        );
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
  const assetStatus = {
    0: "missing",
    1: "AI-generated",
    2: "manually"
  };
  const assetStatusShort = {
    0: "?!",
    1: "AI",
    2: "ME"
  };
  const _sfc_main$c = /* @__PURE__ */ defineComponent({
    __name: "OverwriteConfirmationDialog",
    props: {
      open: { type: Boolean },
      siteName: {}
    },
    emits: ["confirm", "cancel", "update:open"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const emit2 = __emit;
      const doNotShowAgain = useStorage("altpilot-suppress-overwrite-warning", false);
      const handleConfirm = () => {
        emit2("confirm");
        emit2("update:open", false);
      };
      const handleCancel = () => {
        emit2("cancel");
        emit2("update:open", false);
      };
      const __returned__ = { emit: emit2, doNotShowAgain, handleConfirm, handleCancel };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$c = {
    key: 0,
    class: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
  };
  const _hoisted_2$a = { class: "w-full max-w-md rounded-lg bg-white p-6 text-ap-dark-green shadow-xl" };
  const _hoisted_3$9 = { class: "mb-4" };
  const _hoisted_4$8 = { class: "mb-6 flex items-center gap-2" };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return $props.open ? (openBlock(), createElementBlock("div", _hoisted_1$c, [
      createBaseVNode("div", _hoisted_2$a, [
        _cache[4] || (_cache[4] = createBaseVNode("h3", { class: "mb-2 text-lg font-bold" }, "Overwrite Alt Text?", -1)),
        createBaseVNode("p", _hoisted_3$9, [
          _cache[1] || (_cache[1] = createTextVNode(" This will overwrite the existing alt text for ", -1)),
          createBaseVNode("strong", null, toDisplayString($props.siteName), 1),
          _cache[2] || (_cache[2] = createTextVNode(". This action cannot be undone. ", -1))
        ]),
        createBaseVNode("div", _hoisted_4$8, [
          withDirectives(createBaseVNode("input", {
            id: "suppress-warning",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.doNotShowAgain = $event),
            type: "checkbox",
            class: "h-4 w-4 rounded border-ap-dark-green text-ap-dark-green focus:ring-ap-dark-green"
          }, null, 512), [
            [vModelCheckbox, $setup.doNotShowAgain]
          ]),
          _cache[3] || (_cache[3] = createBaseVNode("label", {
            for: "suppress-warning",
            class: "text-sm select-none"
          }, " Don't show this again ", -1))
        ]),
        createBaseVNode("div", { class: "flex justify-end gap-3" }, [
          createBaseVNode("button", {
            class: "rounded-full border border-ap-dark-green bg-white px-3 text-xl text-ap-dark-green transition-colors hover:bg-ap-light-green/30",
            onClick: $setup.handleCancel
          }, " Cancel "),
          createBaseVNode("button", {
            class: "rounded-full border border-ap-dark-green bg-ap-dark-green px-3 text-xl text-ap-light-green transition-colors hover:bg-ap-light-green hover:text-ap-dark-green",
            onClick: $setup.handleConfirm
          }, " Generate ")
        ])
      ])
    ])) : createCommentVNode("", true);
  }
  const OverwriteConfirmationDialog = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__file", "OverwriteConfirmationDialog.vue"]]);
  const _sfc_main$b = /* @__PURE__ */ defineComponent({
    __name: "AssetCard",
    props: {
      asset: {}
    },
    emits: ["click-image"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit2 = __emit;
      const { sites, cpTrigger, primarySiteId: primarySiteId2 } = useGlobalState();
      const suppressOverwriteWarning = useStorage("altpilot-suppress-overwrite-warning", false);
      const confirmationOpen = /* @__PURE__ */ ref(false);
      const pendingGenerationSiteId = /* @__PURE__ */ ref(null);
      const currentSiteId = computed(() => primarySiteId2.value);
      const currentAsset = computed(() => props.asset[currentSiteId.value]);
      const currentSiteHandle = computed(() => {
        return sites.value.find((site) => site.id === currentSiteId.value)?.handle ?? null;
      });
      const charactersRemaining = (siteId) => {
        const value = altTexts[siteId] ?? "";
        return 150 - value.length;
      };
      const { altTexts, hasChanges, hasSiteChanges, saving, save, resetChanges } = useAssetAltEditor(
        props.asset
      );
      const { generateForSite, generatingBySite, isGenerationActive, isGenerationFinished } = useAssetGeneration(props.asset);
      const isGeneratingSite = (siteId) => {
        return generatingBySite[siteId] || isGenerationActive(siteId);
      };
      const getTextareaValue = (siteId) => {
        return isGeneratingSite(siteId) ? "..." : altTexts[siteId] ?? "";
      };
      const handleTextareaInput = (siteId, event) => {
        if (isGeneratingSite(siteId)) {
          return;
        }
        altTexts[siteId] = event.target.value;
      };
      const handleGenerateClick = (siteId) => {
        const currentText = altTexts[siteId] ?? "";
        if (currentText.trim() === "" || suppressOverwriteWarning.value) {
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
        if (!hasChanges.value || saving.value) {
          return;
        }
        await save();
      };
      const handleCancel = () => {
        if (saving.value || !hasChanges.value) {
          return;
        }
        resetChanges();
      };
      const __returned__ = { props, emit: emit2, sites, cpTrigger, primarySiteId: primarySiteId2, suppressOverwriteWarning, confirmationOpen, pendingGenerationSiteId, currentSiteId, currentAsset, currentSiteHandle, charactersRemaining, altTexts, hasChanges, hasSiteChanges, saving, save, resetChanges, generateForSite, generatingBySite, isGenerationActive, isGenerationFinished, isGeneratingSite, getTextareaValue, handleTextareaInput, handleGenerateClick, handleConfirmOverwrite, handleCancelOverwrite, handleSave, handleCancel, get assetStatusShort() {
        return assetStatusShort;
      }, OverwriteConfirmationDialog };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _hoisted_1$b = { class: "relative flex h-full flex-col items-start gap-0 overflow-hidden rounded-[1.25rem] border border-[#ECECEC] bg-white" };
  const _hoisted_2$9 = { class: "relative h-32 w-full" };
  const _hoisted_3$8 = ["src", "alt"];
  const _hoisted_4$7 = {
    key: 0,
    class: "absolute bottom-2 left-2"
  };
  const _hoisted_5$4 = ["href"];
  const _hoisted_6$4 = ["disabled"];
  const _hoisted_7$2 = ["disabled"];
  const _hoisted_8$2 = { class: "flex w-full gap-0 pt-2" };
  const _hoisted_9$1 = { class: "relative flex w-full items-center px-3" };
  const _hoisted_10$1 = { class: "text-ap-dark-green uppercase" };
  const _hoisted_11 = ["disabled", "onClick"];
  const _hoisted_12 = { class: "w-full px-3 py-1" };
  const _hoisted_13 = ["value", "disabled", "onInput"];
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$b, [
      createBaseVNode("div", _hoisted_2$9, [
        createBaseVNode("img", {
          class: "aspect-[4/3] h-full w-full cursor-pointer object-cover",
          src: $setup.currentAsset.url,
          alt: $setup.currentAsset.title,
          onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("click-image", $setup.currentAsset.id))
        }, null, 8, _hoisted_3$8),
        $setup.cpTrigger ? (openBlock(), createElementBlock("div", _hoisted_4$7, [
          createBaseVNode("a", {
            href: `/${$setup.cpTrigger}/assets/edit/${$setup.currentAsset.id}?site=${$setup.currentSiteHandle ?? ""}`,
            target: "_blank",
            class: "w-full overflow-x-hidden text-xs text-ellipsis whitespace-nowrap text-white underline"
          }, toDisplayString($setup.currentAsset.title), 9, _hoisted_5$4)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: normalizeClass(["absolute top-2 right-2 bottom-2 left-2 flex items-center justify-between rounded-2xl p-4 transition-all duration-300 ease-out", [
            $setup.hasChanges ? "pointer-events-auto bg-ap-light-green opacity-100" : "pointer-events-none bg-ap-light-green opacity-0"
          ]])
        }, [
          createBaseVNode("button", {
            class: "rounded-full border border-ap-dark-green px-3 text-xl text-ap-dark-green disabled:opacity-60",
            disabled: $setup.saving || !$setup.hasChanges,
            onClick: $setup.handleSave
          }, toDisplayString($setup.saving ? "saving…" : "save"), 9, _hoisted_6$4),
          createBaseVNode("button", {
            class: "text-ap-dark-green disabled:opacity-60",
            disabled: $setup.saving || !$setup.hasChanges,
            onClick: $setup.handleCancel
          }, " cancel ", 8, _hoisted_7$2)
        ], 2)
      ]),
      createBaseVNode("div", _hoisted_8$2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.sites, (site) => {
          return openBlock(), createElementBlock("div", {
            key: site.id,
            class: "mb-4 flex w-full gap-0 border-b border-[#ECECEC] last:mb-0 last:border-b-0"
          }, [
            createBaseVNode("div", _hoisted_9$1, [
              createBaseVNode("div", _hoisted_10$1, toDisplayString(site.language) + ": " + toDisplayString($setup.assetStatusShort[$setup.props.asset[site.id]?.status ?? 0]), 1),
              createBaseVNode("div", {
                class: normalizeClass(["absolute left-1/2 -translate-x-1/2 text-center text-[#AEAEAE]", $setup.charactersRemaining(site.id) < 0 ? "text-ap-red" : ""])
              }, toDisplayString($setup.charactersRemaining(site.id)), 3),
              createBaseVNode("button", {
                class: normalizeClass(["mb-1 ml-auto rounded-full border p-1 text-ap-dark-green transition-colors hover:bg-ap-light-green/30", {
                  "bg-ap-light-green/30": $setup.generatingBySite[site.id] || $setup.isGenerationActive(site.id)
                }]),
                disabled: $setup.generatingBySite[site.id] || $setup.isGenerationActive(site.id),
                onClick: ($event) => $setup.handleGenerateClick(site.id)
              }, [
                (openBlock(), createElementBlock("svg", {
                  class: normalizeClass(["regenerate-icon", { "animate-spin": $setup.generatingBySite[site.id] || $setup.isGenerationActive(site.id) }]),
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 512 512"
                }, [..._cache[2] || (_cache[2] = [
                  createBaseVNode("path", {
                    fill: "currentColor",
                    d: "M101.83,133.05c-34.52,34.52-53.94,81.31-54.03,130.13-.18,101.9,82.28,184.65,184.17,184.83l.06-32c-40.35-.07-79.02-16.13-107.56-44.66-59.56-59.55-59.56-156.11-.01-215.67l27.54-27.54v79.87s32,0,32,0V72.14s-135.98-.14-135.98-.14l-.03,32,82.81.09-28.96,28.96M279.97,104c40.35.07,79.02,16.13,107.56,44.66,59.56,59.55,59.56,156.11.01,215.67l-27.54,27.54v-79.87s-32,0-32,0v136s136,0,136,0v-32s-82.88,0-82.88,0l29.05-29.05c34.52-34.52,53.94-81.31,54.03-130.13.18-101.9-82.28-184.65-184.17-184.83l-.06,32"
                  }, null, -1)
                ])], 2))
              ], 10, _hoisted_11)
            ]),
            createBaseVNode("div", _hoisted_12, [
              createBaseVNode("textarea", {
                value: $setup.getTextareaValue(site.id),
                disabled: $setup.isGeneratingSite(site.id),
                onInput: ($event) => $setup.handleTextareaInput(site.id, $event),
                class: normalizeClass(["w-full resize-none rounded-lg px-2 py-1 text-base leading-[1.1] text-[#555] transition-colors hover:border-ap-light-green focus:border focus:border-ap-light-green focus:ring-0 focus:outline-none", {
                  "textarea-generating-pulse border border-green-500 text-ap-dark-green": $setup.isGeneratingSite(site.id),
                  "border border-ap-light-green": !$setup.isGeneratingSite(site.id) && $setup.hasSiteChanges(site.id),
                  "border border-ap-red": !$setup.isGeneratingSite(site.id) && !$setup.hasSiteChanges(site.id) && !$setup.altTexts[site.id]?.length,
                  "border border-transparent": !$setup.isGeneratingSite(site.id) && !$setup.hasSiteChanges(site.id) && !!$setup.altTexts[site.id]?.length,
                  "textarea-finish-pulse": !$setup.isGeneratingSite(site.id) && $setup.isGenerationFinished(site.id)
                }]),
                rows: "4"
              }, null, 42, _hoisted_13)
            ])
          ]);
        }), 128))
      ]),
      createVNode($setup["OverwriteConfirmationDialog"], {
        open: $setup.confirmationOpen,
        "onUpdate:open": _cache[1] || (_cache[1] = ($event) => $setup.confirmationOpen = $event),
        "site-name": $setup.sites.find((s) => s.id === $setup.pendingGenerationSiteId)?.language ?? "",
        onConfirm: $setup.handleConfirmOverwrite,
        onCancel: $setup.handleCancelOverwrite
      }, null, 8, ["open", "site-name"])
    ]);
  }
  const AssetCard = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__scopeId", "data-v-a2650928"], ["__file", "AssetCard.vue"]]);
  function createContext(providerComponentName, contextName) {
    const symbolDescription = typeof providerComponentName === "string" && !contextName ? `${providerComponentName}Context` : contextName;
    const injectionKey = Symbol(symbolDescription);
    const injectContext = (fallback) => {
      const context2 = inject(injectionKey, fallback);
      if (context2) return context2;
      if (context2 === null) return context2;
      throw new Error(`Injection \`${injectionKey.toString()}\` not found. Component must be used within ${Array.isArray(providerComponentName) ? `one of the following components: ${providerComponentName.join(", ")}` : `\`${providerComponentName}\``}`);
    };
    const provideContext = (contextValue) => {
      provide(injectionKey, contextValue);
      return contextValue;
    };
    return [injectContext, provideContext];
  }
  function getActiveElement() {
    let activeElement = document.activeElement;
    if (activeElement == null) return null;
    while (activeElement != null && activeElement.shadowRoot != null && activeElement.shadowRoot.activeElement != null) activeElement = activeElement.shadowRoot.activeElement;
    return activeElement;
  }
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
  function isNullish(value) {
    return value === null || value === void 0;
  }
  function renderSlotFragments(children) {
    if (!children) return [];
    return children.flatMap((child) => {
      if (child.type === Fragment) return renderSlotFragments(child.children);
      return [child];
    });
  }
  const [injectConfigProviderContext] = createContext("ConfigProvider");
  function isPlainObject(value) {
    if (value === null || typeof value !== "object") {
      return false;
    }
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
      return false;
    }
    if (Symbol.iterator in value) {
      return false;
    }
    if (Symbol.toStringTag in value) {
      return Object.prototype.toString.call(value) === "[object Module]";
    }
    return true;
  }
  function _defu(baseObject, defaults, namespace = ".", merger) {
    if (!isPlainObject(defaults)) {
      return _defu(baseObject, {}, namespace, merger);
    }
    const object = Object.assign({}, defaults);
    for (const key in baseObject) {
      if (key === "__proto__" || key === "constructor") {
        continue;
      }
      const value = baseObject[key];
      if (value === null || value === void 0) {
        continue;
      }
      if (merger && merger(object, key, value, namespace)) {
        continue;
      }
      if (Array.isArray(value) && Array.isArray(object[key])) {
        object[key] = [...value, ...object[key]];
      } else if (isPlainObject(value) && isPlainObject(object[key])) {
        object[key] = _defu(
          value,
          object[key],
          (namespace ? `${namespace}.` : "") + key.toString(),
          merger
        );
      } else {
        object[key] = value;
      }
    }
    return object;
  }
  function createDefu(merger) {
    return (...arguments_) => (
      // eslint-disable-next-line unicorn/no-array-reduce
      arguments_.reduce((p2, c) => _defu(p2, c, "", merger), {})
    );
  }
  const defu = createDefu();
  const useBodyLockStackCount = /* @__PURE__ */ createSharedComposable(() => {
    const map = /* @__PURE__ */ ref(/* @__PURE__ */ new Map());
    const initialOverflow = /* @__PURE__ */ ref();
    const locked = computed(() => {
      for (const value of map.value.values()) if (value) return true;
      return false;
    });
    const context2 = injectConfigProviderContext({ scrollBody: /* @__PURE__ */ ref(true) });
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
      const config = context2.scrollBody?.value ? typeof context2.scrollBody.value === "object" ? defu({
        padding: context2.scrollBody.value.padding === true ? verticalScrollbarWidth : context2.scrollBody.value.padding,
        margin: context2.scrollBody.value.margin === true ? verticalScrollbarWidth : context2.scrollBody.value.margin
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
    map.value.set(id, initialState);
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
  function useEmitAsProps(emit2) {
    const vm = getCurrentInstance();
    const events = vm?.type.emits;
    const result = {};
    if (!events?.length) console.warn(`No emitted event found. Please check component: ${vm?.type.__name}`);
    events?.forEach((ev) => {
      result[toHandlerKey(camelize(ev))] = (...arg) => emit2(ev, ...arg);
    });
    return result;
  }
  function useForwardExpose() {
    const instance = getCurrentInstance();
    const currentRef = /* @__PURE__ */ ref();
    const currentElement = computed(() => {
      return ["#text", "#comment"].includes(currentRef.value?.$el.nodeName) ? currentRef.value?.$el.nextElementSibling : unrefElement(currentRef);
    });
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
  var getDefaultParent = function(originalTarget) {
    if (typeof document === "undefined") {
      return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
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
      if (parent.contains(target)) {
        return target;
      }
      var correctedTarget = unwrapHost(target);
      if (correctedTarget && parent.contains(correctedTarget)) {
        return correctedTarget;
      }
      console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
      return null;
    }).filter(function(x) {
      return Boolean(x);
    });
  };
  var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
      markerMap[markerName] = /* @__PURE__ */ new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = /* @__PURE__ */ new Set();
    var elementsToStop = new Set(targets);
    var keep = function(el) {
      if (!el || elementsToKeep.has(el)) {
        return;
      }
      elementsToKeep.add(el);
      keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function(parent) {
      if (!parent || elementsToStop.has(parent)) {
        return;
      }
      Array.prototype.forEach.call(parent.children, function(node) {
        if (elementsToKeep.has(node)) {
          deep(node);
        } else {
          try {
            var attr = node.getAttribute(controlAttribute);
            var alreadyHidden = attr !== null && attr !== "false";
            var counterValue = (counterMap.get(node) || 0) + 1;
            var markerValue = (markerCounter.get(node) || 0) + 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            hiddenNodes.push(node);
            if (counterValue === 1 && alreadyHidden) {
              uncontrolledNodes.set(node, true);
            }
            if (markerValue === 1) {
              node.setAttribute(markerName, "true");
            }
            if (!alreadyHidden) {
              node.setAttribute(controlAttribute, "true");
            }
          } catch (e) {
            console.error("aria-hidden: cannot operate on ", node, e);
          }
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
          if (!uncontrolledNodes.has(node)) {
            node.removeAttribute(controlAttribute);
          }
          uncontrolledNodes.delete(node);
        }
        if (!markerValue) {
          node.removeAttribute(markerName);
        }
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
  var hideOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
      markerName = "data-aria-hidden";
    }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = getDefaultParent(originalTarget);
    if (!activeParentNode) {
      return function() {
        return null;
      };
    }
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
    return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
  };
  function useHideOthers(target) {
    let undo;
    watch(() => unrefElement(target), (el) => {
      if (el) undo = hideOthers(el);
      else if (undo) undo();
    });
    onUnmounted(() => {
      if (undo) undo();
    });
  }
  function useId(deterministicId, prefix = "reka") {
    return `${prefix}-${useId$1?.()}`;
  }
  function useStateMachine(initialState, machine) {
    const state = /* @__PURE__ */ ref(initialState);
    function reducer(event) {
      const nextState = machine[state.value][event];
      return nextState ?? state.value;
    }
    const dispatch = (event) => {
      state.value = reducer(event);
    };
    return {
      state,
      dispatch
    };
  }
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
        } else {
          const isAnimating = prevAnimationName !== currentAnimationName;
          if (prevPresent && isAnimating) {
            dispatch("ANIMATION_OUT");
            dispatchCustomEvent("leave");
          } else {
            dispatch("UNMOUNT");
            dispatchCustomEvent("after-leave");
          }
        }
      }
    }, { immediate: true });
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
    const isPresent = computed(() => ["mounted", "unmountSuspended"].includes(state.value));
    return { isPresent };
  }
  function getAnimationName(node) {
    return node ? getComputedStyle(node).animationName || "none" : "none";
  }
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
  const Slot = /* @__PURE__ */ defineComponent({
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
  const SELF_CLOSING_TAGS = [
    "area",
    "img",
    "input"
  ];
  const Primitive = /* @__PURE__ */ defineComponent({
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
  function usePrimitiveElement() {
    const primitiveElement = /* @__PURE__ */ ref();
    const currentElement = computed(() => ["#text", "#comment"].includes(primitiveElement.value?.$el.nodeName) ? primitiveElement.value?.$el.nextElementSibling : unrefElement(primitiveElement));
    return {
      primitiveElement,
      currentElement
    };
  }
  const [injectDialogRootContext, provideDialogRootContext] = createContext("DialogRoot");
  var DialogRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
      const emit2 = __emit;
      const open = /* @__PURE__ */ useVModel(props, "open", emit2, {
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
  var DialogRoot_default = DialogRoot_vue_vue_type_script_setup_true_lang_default;
  var DialogClose_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var DialogClose_default = DialogClose_vue_vue_type_script_setup_true_lang_default;
  const POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
  const FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
  function isLayerExist(layerElement, targetElement) {
    const targetLayer = targetElement.closest("[data-dismissable-layer]");
    const mainLayer = layerElement.dataset.dismissableLayer === "" ? layerElement : layerElement.querySelector("[data-dismissable-layer]");
    const nodeList = Array.from(layerElement.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
    if (targetLayer && (mainLayer === targetLayer || nodeList.indexOf(mainLayer) < nodeList.indexOf(targetLayer))) return true;
    else return false;
  }
  function usePointerDownOutside(onPointerDownOutside, element, enabled = true) {
    const ownerDocument = element?.value?.ownerDocument ?? globalThis?.document;
    const isPointerInsideDOMTree = /* @__PURE__ */ ref(false);
    const handleClickRef = /* @__PURE__ */ ref(() => {
    });
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
          let handleAndDispatchPointerDownOutsideEvent = function() {
            handleAndDispatchCustomEvent$1(POINTER_DOWN_OUTSIDE, onPointerDownOutside, eventDetail);
          };
          const eventDetail = { originalEvent: event };
          if (event.pointerType === "touch") {
            ownerDocument.removeEventListener("click", handleClickRef.value);
            handleClickRef.value = handleAndDispatchPointerDownOutsideEvent;
            ownerDocument.addEventListener("click", handleClickRef.value, { once: true });
          } else handleAndDispatchPointerDownOutsideEvent();
        } else ownerDocument.removeEventListener("click", handleClickRef.value);
        isPointerInsideDOMTree.value = false;
      };
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
        if (event.target && !isFocusInsideDOMTree.value) {
          const eventDetail = { originalEvent: event };
          handleAndDispatchCustomEvent$1(FOCUS_OUTSIDE, onFocusOutside, eventDetail);
        }
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
  const context = /* @__PURE__ */ reactive({
    layersRoot: /* @__PURE__ */ new Set(),
    layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
    originalBodyPointerEvents: void 0,
    branches: /* @__PURE__ */ new Set()
  });
  var DismissableLayer_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
        const isFocusInBranch = [...context.branches].some((branch) => branch?.contains(event.target));
        if (isFocusInBranch) return;
        emits("focusOutside", event);
        emits("interactOutside", event);
        if (!event.defaultPrevented) emits("dismiss");
      }, layerElement);
      onKeyStroke("Escape", (event) => {
        const isHighestLayer = index.value === layers.value.size - 1;
        if (!isHighestLayer) return;
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
  var DismissableLayer_default = DismissableLayer_vue_vue_type_script_setup_true_lang_default;
  var DismissableLayerBranch_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var DismissableLayerBranch_default = DismissableLayerBranch_vue_vue_type_script_setup_true_lang_default;
  const useFocusStackState = /* @__PURE__ */ createGlobalState(() => {
    const stack2 = /* @__PURE__ */ ref([]);
    return stack2;
  });
  function createFocusScopesStack() {
    const stack2 = useFocusStackState();
    return {
      add(focusScope) {
        const activeFocusScope = stack2.value[0];
        if (focusScope !== activeFocusScope) activeFocusScope?.pause();
        stack2.value = arrayRemove(stack2.value, focusScope);
        stack2.value.unshift(focusScope);
      },
      remove(focusScope) {
        stack2.value = arrayRemove(stack2.value, focusScope);
        stack2.value[0]?.resume();
      }
    };
  }
  function arrayRemove(array, item) {
    const updatedArray = [...array];
    const index = updatedArray.indexOf(item);
    if (index !== -1) updatedArray.splice(index, 1);
    return updatedArray;
  }
  const AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
  const AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
  const EVENT_OPTIONS = {
    bubbles: false,
    cancelable: true
  };
  function focusFirst(candidates, { select = false } = {}) {
    const previouslyFocusedElement = getActiveElement();
    for (const candidate of candidates) {
      focus(candidate, { select });
      if (getActiveElement() !== previouslyFocusedElement) return true;
    }
  }
  function getTabbableEdges(container) {
    const candidates = getTabbableCandidates(container);
    const first = findVisible(candidates, container);
    const last = findVisible(candidates.reverse(), container);
    return [first, last];
  }
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
  var FocusScope_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
          const isLastFocusedElementExist = container.contains(lastFocusedElementRef.value);
          if (!isLastFocusedElementExist) focus(container);
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
        const hasFocusedCandidate = container.contains(previouslyFocusedElement);
        if (!hasFocusedCandidate) {
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
          const hasTabbableElementsInside = first && last;
          if (!hasTabbableElementsInside) {
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
  var FocusScope_default = FocusScope_vue_vue_type_script_setup_true_lang_default;
  function getOpenState(open) {
    return open ? "open" : "closed";
  }
  var DialogContentImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var DialogContentImpl_default = DialogContentImpl_vue_vue_type_script_setup_true_lang_default;
  var DialogContentModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            if (isRightClick) event.preventDefault();
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
  var DialogContentModal_default = DialogContentModal_vue_vue_type_script_setup_true_lang_default;
  var DialogContentNonModal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
      const emits = __emit;
      const emitsAsProps = useEmitAsProps(emits);
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
            const targetIsTrigger = unref(rootContext).triggerElement.value?.contains(target);
            if (targetIsTrigger) event.preventDefault();
            if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.value) event.preventDefault();
          })
        }), {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        }, 16);
      };
    }
  });
  var DialogContentNonModal_default = DialogContentNonModal_vue_vue_type_script_setup_true_lang_default;
  var DialogContent_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var DialogContent_default = DialogContent_vue_vue_type_script_setup_true_lang_default;
  var DialogDescription_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var DialogDescription_default = DialogDescription_vue_vue_type_script_setup_true_lang_default;
  var DialogOverlayImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var DialogOverlayImpl_default = DialogOverlayImpl_vue_vue_type_script_setup_true_lang_default;
  var DialogOverlay_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var DialogOverlay_default = DialogOverlay_vue_vue_type_script_setup_true_lang_default;
  var Teleport_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
      const isMounted = /* @__PURE__ */ useMounted();
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
  var Teleport_default = Teleport_vue_vue_type_script_setup_true_lang_default;
  var DialogPortal_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var DialogPortal_default = DialogPortal_vue_vue_type_script_setup_true_lang_default;
  var DialogTitle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var DialogTitle_default = DialogTitle_vue_vue_type_script_setup_true_lang_default;
  const ITEM_DATA_ATTR = "data-reka-collection-item";
  function useCollection(options = {}) {
    const { key = "", isProvider = false } = options;
    const injectionKey = `${key}CollectionProvider`;
    let context2;
    if (isProvider) {
      const itemMap = /* @__PURE__ */ ref(/* @__PURE__ */ new Map());
      const collectionRef = /* @__PURE__ */ ref();
      context2 = {
        collectionRef,
        itemMap
      };
      provide(injectionKey, context2);
    } else context2 = inject(injectionKey);
    const getItems = (includeDisabledItem = false) => {
      const collectionNode = context2.collectionRef.value;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context2.itemMap.value.values());
      const orderedItems = items.sort((a, b) => orderedNodes.indexOf(a.ref) - orderedNodes.indexOf(b.ref));
      if (includeDisabledItem) return orderedItems;
      else return orderedItems.filter((i) => i.ref.dataset.disabled !== "");
    };
    const CollectionSlot = /* @__PURE__ */ defineComponent({
      name: "CollectionSlot",
      inheritAttrs: false,
      setup(_, { slots, attrs }) {
        const { primitiveElement, currentElement } = usePrimitiveElement();
        watch(currentElement, () => {
          context2.collectionRef.value = currentElement.value;
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
            context2.itemMap.value.set(key$1, {
              ref: currentElement.value,
              value: props.value
            });
            cleanupFn(() => context2.itemMap.value.delete(key$1));
          }
        });
        return () => h(Slot, {
          ...attrs,
          [ITEM_DATA_ATTR]: "",
          ref: primitiveElement
        }, slots);
      }
    });
    const reactiveItems = computed(() => Array.from(context2.itemMap.value.values()));
    const itemMapSize = computed(() => context2.itemMap.value.size);
    return {
      getItems,
      reactiveItems,
      itemMapSize,
      CollectionSlot,
      CollectionItem
    };
  }
  var VisuallyHidden_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var VisuallyHidden_default = VisuallyHidden_vue_vue_type_script_setup_true_lang_default;
  var ToastAnnounceExclude_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var ToastAnnounceExclude_default = ToastAnnounceExclude_vue_vue_type_script_setup_true_lang_default;
  const [injectToastProviderContext, provideToastProviderContext] = createContext("ToastProvider");
  var ToastProvider_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
      if (props.label && typeof props.label === "string" && !props.label.trim()) {
        const error = "Invalid prop `label` supplied to `ToastProvider`. Expected non-empty `string`.";
        throw new Error(error);
      }
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
  var ToastProvider_default = ToastProvider_vue_vue_type_script_setup_true_lang_default;
  var ToastAnnounce_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
    __name: "ToastAnnounce",
    setup(__props) {
      const providerContext = injectToastProviderContext();
      const isAnnounced = useTimeout(1e3);
      const renderAnnounceText = /* @__PURE__ */ ref(false);
      useRafFn(() => {
        renderAnnounceText.value = true;
      });
      return (_ctx, _cache) => {
        return unref(isAnnounced) || renderAnnounceText.value ? (openBlock(), createBlock(unref(VisuallyHidden_default), { key: 0 }, {
          default: withCtx(() => [createTextVNode(toDisplayString(unref(providerContext).label.value) + " ", 1), renderSlot(_ctx.$slots, "default")]),
          _: 3
        })) : createCommentVNode("v-if", true);
      };
    }
  });
  var ToastAnnounce_default = ToastAnnounce_vue_vue_type_script_setup_true_lang_default;
  const TOAST_SWIPE_START = "toast.swipeStart";
  const TOAST_SWIPE_MOVE = "toast.swipeMove";
  const TOAST_SWIPE_CANCEL = "toast.swipeCancel";
  const TOAST_SWIPE_END = "toast.swipeEnd";
  const VIEWPORT_PAUSE = "toast.viewportPause";
  const VIEWPORT_RESUME = "toast.viewportResume";
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
    const childNodes = Array.from(container.childNodes);
    childNodes.forEach((node) => {
      if (node.nodeType === node.TEXT_NODE && node.textContent) textContent.push(node.textContent);
      if (isHTMLElement(node)) {
        const isHidden2 = node.ariaHidden || node.hidden || node.style.display === "none";
        const isExcluded = node.dataset.rekaToastAnnounceExclude === "";
        if (!isHidden2) if (isExcluded) {
          const altText = node.dataset.rekaToastAnnounceAlt;
          if (altText) textContent.push(altText);
        } else textContent.push(...getAnnounceTextContent(node));
      }
    });
    return textContent;
  }
  const [injectToastRootContext, provideToastRootContext] = createContext("ToastRoot");
  var ToastRootImpl_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
        const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef.value;
        remainingTime.value = Math.max(closeTimerRemainingTimeRef.value - elapsedTime, 0);
      }, { fpsLimit: 60 });
      function startTimer(duration$1) {
        if (duration$1 <= 0 || duration$1 === Number.POSITIVE_INFINITY) return;
        if (!isClient) return;
        window.clearTimeout(closeTimerRef.value);
        closeTimerStartTimeRef.value = (/* @__PURE__ */ new Date()).getTime();
        closeTimerRef.value = window.setTimeout(handleClose, duration$1);
      }
      function handleClose(event) {
        const isNonPointerEvent = event?.pointerType === "";
        const isFocusInToast = currentElement.value?.contains(getActiveElement());
        if (isFocusInToast && isNonPointerEvent) providerContext.viewport.value?.focus();
        if (isNonPointerEvent) providerContext.isClosePausedRef.value = false;
        emits("close");
      }
      const announceTextContent = computed(() => currentElement.value ? getAnnounceTextContent(currentElement.value) : null);
      if (props.type && !["foreground", "background"].includes(props.type)) {
        const error = "Invalid prop `type` supplied to `Toast`. Expected `foreground | background`.";
        throw new Error(error);
      }
      watchEffect((cleanupFn) => {
        const viewport = providerContext.viewport.value;
        if (viewport) {
          const handleResume = () => {
            startTimer(closeTimerRemainingTimeRef.value);
            remainingRaf.resume();
            emits("resume");
          };
          const handlePause = () => {
            const elapsedTime = (/* @__PURE__ */ new Date()).getTime() - closeTimerStartTimeRef.value;
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
          "aria-live": _ctx.type === "foreground" ? "assertive" : "polite",
          "aria-atomic": "true"
        }, {
          default: withCtx(() => [createTextVNode(toDisplayString(announceTextContent.value), 1)]),
          _: 1
        }, 8, ["aria-live"])) : createCommentVNode("v-if", true), unref(providerContext).viewport.value ? (openBlock(), createBlock(Teleport, {
          key: 1,
          to: unref(providerContext).viewport.value
        }, [createVNode(unref(CollectionItem), null, {
          default: withCtx(() => [createVNode(unref(Primitive), mergeProps({
            ref: unref(forwardRef),
            role: "alert",
            "aria-live": "off",
            "aria-atomic": "true",
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
                unref(handleAndDispatchCustomEvent)(unref(TOAST_SWIPE_MOVE), (ev) => emits("swipeMove", ev), eventDetail);
              } else if (unref(isDeltaInDirection)(delta, unref(providerContext).swipeDirection.value, moveStartBuffer)) {
                swipeDeltaRef.value = delta;
                unref(handleAndDispatchCustomEvent)(unref(TOAST_SWIPE_START), (ev) => emits("swipeStart", ev), eventDetail);
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
                if (unref(isDeltaInDirection)(delta, unref(providerContext).swipeDirection.value, unref(providerContext).swipeThreshold.value)) unref(handleAndDispatchCustomEvent)(unref(TOAST_SWIPE_END), (ev) => emits("swipeEnd", ev), eventDetail);
                else unref(handleAndDispatchCustomEvent)(unref(TOAST_SWIPE_CANCEL), (ev) => emits("swipeCancel", ev), eventDetail);
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
  var ToastRootImpl_default = ToastRootImpl_vue_vue_type_script_setup_true_lang_default;
  var ToastClose_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var ToastClose_default = ToastClose_vue_vue_type_script_setup_true_lang_default;
  var ToastAction_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
      const props = __props;
      if (!props.altText) throw new Error("Missing prop `altText` expected on `ToastAction`");
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
  var ToastAction_default = ToastAction_vue_vue_type_script_setup_true_lang_default;
  var ToastDescription_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var ToastDescription_default = ToastDescription_vue_vue_type_script_setup_true_lang_default;
  var ToastRoot_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
      const open = /* @__PURE__ */ useVModel(props, "open", emits, {
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
  var ToastRoot_default = ToastRoot_vue_vue_type_script_setup_true_lang_default;
  var ToastTitle_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
  var ToastTitle_default = ToastTitle_vue_vue_type_script_setup_true_lang_default;
  var FocusProxy_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
    __name: "FocusProxy",
    emits: ["focusFromOutsideViewport"],
    setup(__props, { emit: __emit }) {
      const emits = __emit;
      const providerContext = injectToastProviderContext();
      return (_ctx, _cache) => {
        return openBlock(), createBlock(unref(VisuallyHidden_default), {
          "aria-hidden": "true",
          tabindex: "0",
          style: { "position": "fixed" },
          onFocus: _cache[0] || (_cache[0] = (event) => {
            const prevFocusedElement = event.relatedTarget;
            const isFocusFromOutsideViewport = !unref(providerContext).viewport.value?.contains(prevFocusedElement);
            if (isFocusFromOutsideViewport) emits("focusFromOutsideViewport");
          })
        }, {
          default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
          _: 3
        });
      };
    }
  });
  var FocusProxy_default = FocusProxy_vue_vue_type_script_setup_true_lang_default;
  var ToastViewport_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ defineComponent({
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
      const props = __props;
      const { hotkey, label } = /* @__PURE__ */ toRefs(props);
      const { forwardRef, currentElement } = useForwardExpose();
      const { CollectionSlot, getItems } = useCollection();
      const providerContext = injectToastProviderContext();
      const hasToasts = computed(() => providerContext.toastCount.value > 0);
      const headFocusProxyRef = /* @__PURE__ */ ref();
      const tailFocusProxyRef = /* @__PURE__ */ ref();
      const hotkeyMessage = computed(() => hotkey.value.join("+").replace(/Key/g, "").replace(/Digit/g, ""));
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
            const isFocusMovingOutside = !viewport.contains(event.relatedTarget);
            if (isFocusMovingOutside) handleResume();
          };
          const handlePointerLeaveResume = () => {
            const isFocusInside = viewport.contains(getActiveElement());
            if (!isFocusInside) handleResume();
          };
          const handleKeyDown = (event) => {
            const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
            const isTabKey = event.key === "Tab" && !isMetaKey;
            if (isTabKey) {
              const focusedElement = getActiveElement();
              const isTabbingBackwards = event.shiftKey;
              const targetIsViewport = event.target === viewport;
              if (targetIsViewport && isTabbingBackwards) {
                headFocusProxyRef.value?.focus();
                return;
              }
              const tabbingDirection = isTabbingBackwards ? "backwards" : "forwards";
              const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection });
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
        const toastItems = getItems().map((i) => i.ref);
        const tabbableCandidates = toastItems.map((toastNode) => {
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
                headFocusProxyRef.value = unref(unrefElement)(node);
                return void 0;
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
                tailFocusProxyRef.value = unref(unrefElement)(node);
                return void 0;
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
  var ToastViewport_default = ToastViewport_vue_vue_type_script_setup_true_lang_default;
  const _sfc_main$a = /* @__PURE__ */ defineComponent({
    __name: "AssetLightbox",
    props: {
      open: { type: Boolean },
      initialAssetId: {},
      assets: {},
      primarySiteId: {}
    },
    emits: ["update:open"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit2 = __emit;
      const currentIndex = /* @__PURE__ */ ref(0);
      watch(
        () => props.open,
        (isOpen) => {
          if (isOpen && props.initialAssetId !== null) {
            const index = props.assets.findIndex(
              (a) => a[props.primarySiteId]?.id === props.initialAssetId
            );
            if (index !== -1) {
              currentIndex.value = index;
            }
          }
        }
      );
      const currentAssetWrapper = computed(() => props.assets[currentIndex.value]);
      const currentAsset = computed(() => {
        if (!currentAssetWrapper.value) return null;
        return currentAssetWrapper.value[props.primarySiteId];
      });
      function next() {
        if (currentIndex.value < props.assets.length - 1) {
          currentIndex.value++;
        } else {
          currentIndex.value = 0;
        }
      }
      function prev() {
        if (currentIndex.value > 0) {
          currentIndex.value--;
        } else {
          currentIndex.value = props.assets.length - 1;
        }
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
      const __returned__ = { props, emit: emit2, currentIndex, currentAssetWrapper, currentAsset, next, prev, onKeydown, get DialogRoot() {
        return DialogRoot_default;
      }, get DialogPortal() {
        return DialogPortal_default;
      }, get DialogOverlay() {
        return DialogOverlay_default;
      }, get DialogContent() {
        return DialogContent_default;
      }, get DialogClose() {
        return DialogClose_default;
      }, get DialogTitle() {
        return DialogTitle_default;
      }, get DialogDescription() {
        return DialogDescription_default;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _hoisted_1$a = {
    key: 0,
    class: "relative flex w-full flex-col items-center"
  };
  const _hoisted_2$8 = { class: "flex h-[min(62vh,520px)] w-full max-w-[calc(100vw-2rem)] items-center justify-center bg-white p-3 shadow-2xl sm:h-[min(78vh,900px)] sm:w-[960px] sm:max-w-[calc(100vw-8rem)] sm:p-6" };
  const _hoisted_3$7 = ["src", "alt"];
  const _hoisted_4$6 = { class: "mt-4 max-w-[calc(100vw-2rem)] text-center text-base font-medium text-white sm:max-w-[calc(100vw-8rem)] sm:text-lg" };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock($setup["DialogRoot"], {
      open: $props.open,
      "onUpdate:open": _cache[0] || (_cache[0] = ($event) => $setup.emit("update:open", $event))
    }, {
      default: withCtx(() => [
        createVNode($setup["DialogPortal"], null, {
          default: withCtx(() => [
            createVNode($setup["DialogOverlay"], { class: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity" }),
            createVNode($setup["DialogContent"], { class: "fixed top-1/2 left-1/2 z-50 flex w-full max-w-7xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center px-3 py-4 shadow-none outline-none sm:p-4" }, {
              default: withCtx(() => [
                createVNode($setup["DialogTitle"], { class: "sr-only" }, {
                  default: withCtx(() => [..._cache[1] || (_cache[1] = [
                    createTextVNode(" Asset Preview ", -1)
                  ])]),
                  _: 1
                }),
                createVNode($setup["DialogDescription"], { class: "sr-only" }, {
                  default: withCtx(() => [..._cache[2] || (_cache[2] = [
                    createTextVNode(" Preview of the selected asset ", -1)
                  ])]),
                  _: 1
                }),
                $setup.currentAsset ? (openBlock(), createElementBlock("div", _hoisted_1$a, [
                  createVNode($setup["DialogClose"], { class: "absolute -top-[0.75rem] right-4 cursor-pointer p-2 text-white mix-blend-difference hover:text-gray-300 focus:outline-none max-md:hidden xl:right-14" }, {
                    default: withCtx(() => [..._cache[3] || (_cache[3] = [
                      createBaseVNode("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "24",
                        height: "24",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      }, [
                        createBaseVNode("path", { d: "M18 6 6 18" }),
                        createBaseVNode("path", { d: "M6 6 18 18" })
                      ], -1)
                    ])]),
                    _: 1
                  }),
                  createBaseVNode("div", _hoisted_2$8, [
                    createBaseVNode("img", {
                      src: $setup.currentAsset.url,
                      alt: $setup.currentAsset.title || "Asset",
                      class: "h-full w-full object-contain"
                    }, null, 8, _hoisted_3$7)
                  ]),
                  createBaseVNode("div", _hoisted_4$6, toDisplayString($setup.currentAsset.title), 1),
                  createBaseVNode("button", {
                    class: "absolute top-1/2 left-1 -translate-y-1/2 cursor-pointer p-2 text-white mix-blend-difference hover:text-gray-300 focus:outline-none sm:left-[max(2vw,0.5rem)]",
                    onClick: $setup.prev,
                    title: "Previous"
                  }, [..._cache[4] || (_cache[4] = [
                    createBaseVNode("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "28",
                      height: "28",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    }, [
                      createBaseVNode("path", { d: "m15 18-6-6 6-6" })
                    ], -1)
                  ])]),
                  createBaseVNode("button", {
                    class: "absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer p-2 text-white mix-blend-difference hover:text-gray-300 focus:outline-none sm:right-[max(2vw,0.5rem)]",
                    onClick: $setup.next,
                    title: "Next"
                  }, [..._cache[5] || (_cache[5] = [
                    createBaseVNode("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "28",
                      height: "28",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    }, [
                      createBaseVNode("path", { d: "m9 18 6-6-6-6" })
                    ], -1)
                  ])])
                ])) : createCommentVNode("", true)
              ]),
              _: 1
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["open"]);
  }
  const AssetLightbox = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__file", "AssetLightbox.vue"]]);
  const _sfc_main$9 = {};
  const _hoisted_1$9 = { class: "relative flex h-full flex-col items-start gap-0 overflow-hidden rounded-[1.25rem] border border-[#ECECEC] bg-white" };
  const _hoisted_2$7 = { class: "flex w-full flex-col pt-2" };
  function _sfc_render$9(_ctx, _cache) {
    return openBlock(), createElementBlock("div", _hoisted_1$9, [
      _cache[1] || (_cache[1] = createBaseVNode("div", { class: "relative h-32 w-full" }, [
        createBaseVNode("div", { class: "skeleton-shimmer h-full w-full bg-gray-200" })
      ], -1)),
      createBaseVNode("div", _hoisted_2$7, [
        (openBlock(), createElementBlock(Fragment, null, renderList(2, (i) => {
          return createBaseVNode("div", {
            key: `site-skeleton-${i}`,
            class: "mb-4 flex w-full border-b border-[#ECECEC] last:mb-0 last:border-b-0"
          }, [..._cache[0] || (_cache[0] = [
            createStaticVNode('<div class="relative flex w-full items-center px-3" data-v-7baa44f7><div class="skeleton-shimmer h-4 w-24 rounded bg-gray-200" data-v-7baa44f7></div><div class="skeleton-shimmer absolute left-1/2 h-4 w-10 -translate-x-1/2 rounded bg-gray-200" data-v-7baa44f7></div><div class="skeleton-shimmer mb-1 ml-auto h-7 w-7 rounded-full border border-gray-300 bg-gray-100" data-v-7baa44f7></div></div><div class="w-full px-3 py-1" data-v-7baa44f7><div class="skeleton-shimmer h-20 w-full rounded-lg border border-gray-200 bg-gray-100" data-v-7baa44f7></div></div>', 2)
          ])]);
        }), 64))
      ])
    ]);
  }
  const AssetCardSkeleton = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-7baa44f7"], ["__file", "AssetCardSkeleton.vue"]]);
  const _sfc_main$8 = /* @__PURE__ */ defineComponent({
    __name: "AssetPagination",
    props: {
      pagination: {}
    },
    emits: ["previous", "next", "page-change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit2 = __emit;
      const currentPage = computed(() => {
        if (!props.pagination) return 1;
        return Math.floor(props.pagination.offset / props.pagination.limit) + 1;
      });
      const pageInput = /* @__PURE__ */ ref(1);
      watch(
        currentPage,
        (val) => {
          pageInput.value = val;
        },
        { immediate: true }
      );
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
        emit2("previous");
      };
      const handleNext = () => {
        if (!props.pagination || !canGoNext.value) return;
        emit2("next");
      };
      const handleInput = () => {
        if (!props.pagination) return;
        let page = pageInput.value;
        if (page < 1) page = 1;
        if (page > totalPages.value) page = totalPages.value;
        pageInput.value = page;
        if (page !== currentPage.value) {
          emit2("page-change", page);
        }
      };
      const __returned__ = { props, emit: emit2, currentPage, pageInput, totalPages, canGoPrevious, canGoNext, handlePrevious, handleNext, handleInput };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _hoisted_1$8 = {
    key: 0,
    class: "mt-6 flex items-center justify-center gap-4"
  };
  const _hoisted_2$6 = ["disabled"];
  const _hoisted_3$6 = { class: "flex items-center gap-2" };
  const _hoisted_4$5 = ["max"];
  const _hoisted_5$3 = { class: "text-sm text-ap-dark-green" };
  const _hoisted_6$3 = ["disabled"];
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return $props.pagination ? (openBlock(), createElementBlock("div", _hoisted_1$8, [
      createBaseVNode("button", {
        onClick: $setup.handlePrevious,
        disabled: !$setup.canGoPrevious,
        class: "disabled:cursor-not-allowed disabled:opacity-50"
      }, [..._cache[1] || (_cache[1] = [
        createBaseVNode("svg", {
          width: "30",
          height: "30",
          viewBox: "0 0 30 30",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        }, [
          createBaseVNode("circle", {
            cx: "15",
            cy: "15",
            r: "14.5",
            transform: "matrix(-1 0 0 1 30 0)",
            stroke: "#3C6E4E"
          }),
          createBaseVNode("path", {
            d: "M7.29289 15.7071C6.90237 15.3166 6.90237 14.6834 7.29289 14.2929L13.6569 7.92893C14.0474 7.53841 14.6805 7.53841 15.0711 7.92893C15.4616 8.31946 15.4616 8.95262 15.0711 9.34315L9.41421 15L15.0711 20.6569C15.4616 21.0474 15.4616 21.6805 15.0711 22.0711C14.6805 22.4616 14.0474 22.4616 13.6569 22.0711L7.29289 15.7071ZM23 15V16L8 16V15V14L23 14V15Z",
            fill: "#3C6E4E"
          })
        ], -1)
      ])], 8, _hoisted_2$6),
      createBaseVNode("div", _hoisted_3$6, [
        withDirectives(createBaseVNode("input", {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.pageInput = $event),
          onChange: $setup.handleInput,
          onKeyup: withKeys($setup.handleInput, ["enter"]),
          type: "number",
          min: "1",
          max: $setup.totalPages,
          class: "w-16 rounded border border-ap-dark-green px-2 py-1 text-center text-ap-dark-green"
        }, null, 40, _hoisted_4$5), [
          [
            vModelText,
            $setup.pageInput,
            void 0,
            { number: true }
          ]
        ]),
        createBaseVNode("span", _hoisted_5$3, " / " + toDisplayString($setup.totalPages), 1)
      ]),
      createBaseVNode("button", {
        onClick: $setup.handleNext,
        disabled: !$setup.canGoNext,
        class: "disabled:cursor-not-allowed disabled:opacity-50"
      }, [..._cache[2] || (_cache[2] = [
        createBaseVNode("svg", {
          width: "30",
          height: "30",
          viewBox: "0 0 30 30",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        }, [
          createBaseVNode("circle", {
            cx: "15",
            cy: "15",
            r: "14.5",
            stroke: "#3C6E4E"
          }),
          createBaseVNode("path", {
            d: "M22.7071 15.7071C23.0976 15.3166 23.0976 14.6834 22.7071 14.2929L16.3431 7.92893C15.9526 7.53841 15.3195 7.53841 14.9289 7.92893C14.5384 8.31946 14.5384 8.95262 14.9289 9.34315L20.5858 15L14.9289 20.6569C14.5384 21.0474 14.5384 21.6805 14.9289 22.0711C15.3195 22.4616 15.9526 22.4616 16.3431 22.0711L22.7071 15.7071ZM7 15V16L22 16V15V14L7 14V15Z",
            fill: "#3C6E4E"
          })
        ], -1)
      ])], 8, _hoisted_6$3)
    ])) : createCommentVNode("", true);
  }
  const AssetPagination = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__file", "AssetPagination.vue"]]);
  const _sfc_main$7 = /* @__PURE__ */ defineComponent({
    __name: "AltPilotSearch",
    setup(__props, { expose: __expose }) {
      __expose();
      const { fetchAssets, query } = useAssets();
      const searchQuery = /* @__PURE__ */ ref(query.value || "");
      const debouncedSearch = /* @__PURE__ */ useDebounceFn((val) => {
        query.value = val;
        fetchAssets({ offset: 0 });
      }, 400);
      watch(searchQuery, (newVal) => {
        debouncedSearch(newVal);
      });
      watch(
        () => query.value,
        (newVal) => {
          if (newVal !== searchQuery.value) {
            searchQuery.value = newVal;
          }
        }
      );
      const clearSearch = () => {
        searchQuery.value = "";
      };
      const __returned__ = { fetchAssets, query, searchQuery, debouncedSearch, clearSearch };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _hoisted_1$7 = { class: "relative" };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$7, [
      withDirectives(createBaseVNode("input", {
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.searchQuery = $event),
        type: "text",
        class: "block h-12 w-full rounded-full border border-ap-dark-green pr-12 pl-12 text-xl text-ap-dark-green transition-colors focus:bg-ap-light-green/30 focus:ring-0 focus:ring-ap-dark-green focus:outline-none"
      }, null, 512), [
        [vModelText, $setup.searchQuery]
      ]),
      _cache[2] || (_cache[2] = createBaseVNode("div", { class: "pointer-events-none absolute inset-y-0 left-3 flex items-center" }, [
        createBaseVNode("svg", {
          class: "h-6 w-6 text-ap-dark-green",
          "aria-hidden": "true",
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 20 20"
        }, [
          createBaseVNode("path", {
            stroke: "currentColor",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          })
        ])
      ], -1)),
      $setup.searchQuery ? (openBlock(), createElementBlock("button", {
        key: 0,
        onClick: $setup.clearSearch,
        type: "button",
        class: "absolute inset-y-0 right-3 flex items-center p-1 text-ap-dark-green hover:text-ap-dark-green/80",
        "aria-label": "Clear search"
      }, [..._cache[1] || (_cache[1] = [
        createBaseVNode("svg", {
          class: "h-4 w-4",
          "aria-hidden": "true",
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 14 14"
        }, [
          createBaseVNode("path", {
            stroke: "currentColor",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            "stroke-width": "2",
            d: "m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          })
        ], -1)
      ])])) : createCommentVNode("", true)
    ]);
  }
  const AltPilotSearch = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__file", "AltPilotSearch.vue"]]);
  const _sfc_main$6 = {};
  const _hoisted_1$6 = {
    width: "144",
    height: "144",
    viewBox: "0 0 144 144",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };
  function _sfc_render$6(_ctx, _cache) {
    return openBlock(), createElementBlock("svg", _hoisted_1$6, [..._cache[0] || (_cache[0] = [
      createBaseVNode("path", {
        d: "M0 15C0 6.71573 6.71573 0 15 0H129C137.284 0 144 6.71573 144 15V129C144 137.284 137.284 144 129 144H15C6.71573 144 0 137.284 0 129V15Z",
        fill: "#8FF5B3"
      }, null, -1),
      createBaseVNode("path", {
        d: "M25 17.5H39.7686C42.0149 17.5 44.1428 18.5073 45.5674 20.2441L122.664 114.244C126.679 119.14 123.196 126.5 116.865 126.5H25C20.8579 126.5 17.5 123.142 17.5 119V25C17.5 20.8579 20.8579 17.5 25 17.5Z",
        fill: "#3C6E4E",
        stroke: "#3C6E4E",
        "stroke-width": "5"
      }, null, -1)
    ])]);
  }
  const AltPilotLogo = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__file", "AltPilotLogo.vue"]]);
  const _sfc_main$5 = /* @__PURE__ */ defineComponent({
    __name: "AltPilotHeaderTotal",
    setup(__props, { expose: __expose }) {
      __expose();
      const { total } = useStatusCounts();
      const formatNumber = (num) => {
        return num.toLocaleString("de-DE");
      };
      const __returned__ = { total, formatNumber, AltPilotLogo };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _hoisted_1$5 = { class: "flex items-center gap-5 text-ap-dark-green" };
  const _hoisted_2$5 = { class: "pointer-events-none mb-2 flex h-14 w-14 shrink-0 items-center justify-center self-end rounded-2xl pt-1 text-ap-dark-green" };
  const _hoisted_3$5 = { class: "m-0 mt-1 text-[3.75rem] leading-[1]" };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$5, [
      createBaseVNode("div", _hoisted_2$5, [
        createVNode($setup["AltPilotLogo"], { class: "max-h-12 w-12" })
      ]),
      createBaseVNode("div", null, [
        createBaseVNode("p", _hoisted_3$5, toDisplayString($setup.formatNumber($setup.total)), 1)
      ])
    ]);
  }
  const AltPilotHeaderTotal = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__file", "AltPilotHeaderTotal.vue"]]);
  const _sfc_main$4 = /* @__PURE__ */ defineComponent({
    __name: "AltPilotHeaderStats",
    setup(__props, { expose: __expose }) {
      __expose();
      const { missingCount, aiGeneratedCount, manualCount, fetchStatusCounts } = useStatusCounts();
      useIntervalFn(() => {
        fetchStatusCounts();
      }, 6e4);
      const formatNumber = (num) => num.toLocaleString("de-DE");
      const __returned__ = { missingCount, aiGeneratedCount, manualCount, fetchStatusCounts, formatNumber, get assetStatus() {
        return assetStatus;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _hoisted_1$4 = { class: "text-ap-dark-green" };
  const _hoisted_2$4 = { class: "grid grid-cols-[max-content_max-content] gap-x-3 gap-y-0.5 pt-1 text-sm leading-[1.15]" };
  const _hoisted_3$4 = { class: "m-0" };
  const _hoisted_4$4 = { class: "m-0" };
  const _hoisted_5$2 = { class: "m-0" };
  const _hoisted_6$2 = { class: "m-0" };
  const _hoisted_7$1 = { class: "m-0" };
  const _hoisted_8$1 = { class: "m-0" };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$4, [
      createBaseVNode("div", _hoisted_2$4, [
        createBaseVNode("p", _hoisted_3$4, toDisplayString($setup.assetStatus[1]), 1),
        createBaseVNode("p", _hoisted_4$4, toDisplayString($setup.formatNumber($setup.aiGeneratedCount)), 1),
        createBaseVNode("p", _hoisted_5$2, toDisplayString($setup.assetStatus[2]), 1),
        createBaseVNode("p", _hoisted_6$2, toDisplayString($setup.formatNumber($setup.manualCount)), 1),
        createBaseVNode("p", _hoisted_7$1, toDisplayString($setup.assetStatus[0]), 1),
        createBaseVNode("p", _hoisted_8$1, toDisplayString($setup.formatNumber($setup.missingCount)), 1)
      ])
    ]);
  }
  const AltPilotHeaderStats = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "AltPilotHeaderStats.vue"]]);
  const _sfc_main$3 = /* @__PURE__ */ defineComponent({
    __name: "AltPilotFilter",
    setup(__props, { expose: __expose }) {
      __expose();
      const { sites } = useGlobalState();
      const { sort, fetchAssets, filter, pagination } = useAssets();
      const filterOptions = [
        { value: "all", label: "all" },
        { value: "missing", label: "missing" },
        { value: "manual", label: "manually" },
        { value: "ai-generated", label: "AI-generated" }
      ];
      const setFilter = (value) => {
        if (filter.value === value) return;
        filter.value = value;
        fetchAssets({ offset: 0 });
      };
      const sortOptions = [
        { value: "dateUpdated", label: "last edited" },
        { value: "dateCreated", label: "image: last uploaded" },
        { value: "filename", label: "image: filename" }
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
      const __returned__ = { sites, sort, fetchAssets, filter, pagination, filterOptions, setFilter, sortOptions, setSort, onSortChange };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _hoisted_1$3 = { class: "my-4" };
  const _hoisted_2$3 = { class: "grid grid-cols-[1fr_max-content] items-end gap-4 max-md:grid-cols-1" };
  const _hoisted_3$3 = { class: "text-xl text-ap-dark-green" };
  const _hoisted_4$3 = { class: "flex md:justify-self-end" };
  const _hoisted_5$1 = { class: "flex flex-wrap gap-2" };
  const _hoisted_6$1 = ["onClick"];
  const _hoisted_7 = { class: "sm:ml-4" };
  const _hoisted_8 = { class: "relative" };
  const _hoisted_9 = ["value"];
  const _hoisted_10 = ["value"];
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1$3, [
      createBaseVNode("div", _hoisted_2$3, [
        createBaseVNode("div", null, [
          _cache[0] || (_cache[0] = createBaseVNode("div", { class: "mb-ap-title-p text-sm text-ap-dark-green" }, "showing results", -1)),
          createBaseVNode("div", _hoisted_3$3, " alt texts for " + toDisplayString($setup.pagination?.total || 0) + " images in " + toDisplayString($setup.sites.length) + " languages ", 1)
        ]),
        createBaseVNode("div", _hoisted_4$3, [
          createBaseVNode("div", null, [
            _cache[1] || (_cache[1] = createBaseVNode("p", { class: "mb-1 mb-ap-title-p text-sm leading-[1.2] text-ap-dark-green" }, "filter", -1)),
            createBaseVNode("ul", _hoisted_5$1, [
              (openBlock(), createElementBlock(Fragment, null, renderList($setup.filterOptions, (option) => {
                return createBaseVNode("li", {
                  key: option.value
                }, [
                  createBaseVNode("button", {
                    type: "button",
                    onClick: ($event) => $setup.setFilter(option.value),
                    class: normalizeClass([
                      "rounded-full border border-ap-dark-green px-3 py-1 text-xs leading-none transition-colors hover:bg-ap-light-green/30",
                      $setup.filter === option.value ? "bg-ap-light-green text-black" : "text-ap-dark-green"
                    ])
                  }, toDisplayString(option.label), 11, _hoisted_6$1)
                ]);
              }), 64))
            ])
          ]),
          createBaseVNode("div", _hoisted_7, [
            _cache[3] || (_cache[3] = createBaseVNode("p", { class: "mb-1 mb-ap-title-p text-sm leading-[1.2] text-ap-dark-green" }, "sort by", -1)),
            createBaseVNode("div", _hoisted_8, [
              createBaseVNode("select", {
                class: "w-full appearance-none rounded-full border border-ap-dark-green py-1 pr-8 pl-3 text-xs leading-[1.2] text-ap-dark-green focus:ring-1 focus:ring-ap-dark-green focus:outline-none",
                value: $setup.sort,
                onChange: $setup.onSortChange
              }, [
                (openBlock(), createElementBlock(Fragment, null, renderList($setup.sortOptions, (option) => {
                  return createBaseVNode("option", {
                    key: option.value,
                    value: option.value
                  }, toDisplayString(option.label), 9, _hoisted_10);
                }), 64))
              ], 40, _hoisted_9),
              _cache[2] || (_cache[2] = createBaseVNode("span", {
                class: "pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ap-dark-green",
                "aria-hidden": "true"
              }, [
                createBaseVNode("svg", {
                  class: "h-2.5 w-2.5",
                  viewBox: "0 0 10 6",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                }, [
                  createBaseVNode("path", {
                    d: "M1 1L5 5L9 1",
                    stroke: "currentColor",
                    "stroke-width": "1.5",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  })
                ])
              ], -1))
            ])
          ])
        ])
      ])
    ]);
  }
  const AltPilotFilter = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "AltPilotFilter.vue"]]);
  const _sfc_main$2 = /* @__PURE__ */ defineComponent({
    __name: "AltPilotHeader",
    setup(__props, { expose: __expose }) {
      __expose();
      const __returned__ = { AltPilotSearch, AltPilotHeaderTotal, AltPilotHeaderStats, AltPilotFilter };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _hoisted_1$2 = { class: "grid grid-cols-[max-content_max-content_1fr] items-start gap-x-6 gap-y-4 border-b border-ap-dark-green max-md:grid-cols-2 max-md:pb-4" };
  const _hoisted_2$2 = { class: "justify-self-start" };
  const _hoisted_3$2 = { class: "justify-self-start" };
  const _hoisted_4$2 = { class: "w-full max-w-lg justify-self-end pt-1" };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", null, [
      createBaseVNode("div", _hoisted_1$2, [
        createBaseVNode("div", _hoisted_2$2, [
          createVNode($setup["AltPilotHeaderTotal"])
        ]),
        createBaseVNode("div", _hoisted_3$2, [
          createVNode($setup["AltPilotHeaderStats"])
        ]),
        createBaseVNode("div", _hoisted_4$2, [
          createVNode($setup["AltPilotSearch"])
        ])
      ]),
      createVNode($setup["AltPilotFilter"], { class: "mt-4" })
    ]);
  }
  const AltPilotHeader = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "AltPilotHeader.vue"]]);
  const _sfc_main$1 = /* @__PURE__ */ defineComponent({
    __name: "AltPilotToaster",
    setup(__props, { expose: __expose }) {
      __expose();
      const { toasts, dismiss, onOpenChange } = useToasts();
      const __returned__ = { toasts, dismiss, onOpenChange, get ToastAction() {
        return ToastAction_default;
      }, get ToastClose() {
        return ToastClose_default;
      }, get ToastDescription() {
        return ToastDescription_default;
      }, get ToastProvider() {
        return ToastProvider_default;
      }, get ToastRoot() {
        return ToastRoot_default;
      }, get ToastTitle() {
        return ToastTitle_default;
      }, get ToastViewport() {
        return ToastViewport_default;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _hoisted_1$1 = { class: "px-3 py-2 pr-9" };
  const _hoisted_2$1 = { class: "min-w-0" };
  const _hoisted_3$1 = {
    key: 0,
    class: "flex justify-end px-3 pb-2"
  };
  const _hoisted_4$1 = ["onClick"];
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createBlock($setup["ToastProvider"], {
      duration: 5e3,
      "swipe-direction": "right"
    }, {
      default: withCtx(() => [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.toasts, (t) => {
          return openBlock(), createBlock($setup["ToastRoot"], {
            key: t.id,
            open: t.open,
            "onUpdate:open": [($event) => t.open = $event, (open) => $setup.onOpenChange(t.id, open)],
            duration: t.duration,
            type: t.type,
            class: "toast-transition relative w-full overflow-hidden rounded-2xl border border-ap-dark-green bg-ap-light-green text-ap-dark-green"
          }, {
            default: withCtx(() => [
              createVNode($setup["ToastClose"], { "as-child": "" }, {
                default: withCtx(() => [..._cache[0] || (_cache[0] = [
                  createBaseVNode("button", {
                    type: "button",
                    class: "absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full border-ap-dark-green text-ap-dark-green transition-colors hover:border hover:bg-ap-dark-green/10",
                    "aria-label": "Close"
                  }, [
                    createBaseVNode("svg", {
                      "aria-hidden": "true",
                      viewBox: "0 0 12 12",
                      class: "h-2.5 w-2.5"
                    }, [
                      createBaseVNode("path", {
                        d: "M2 2 L10 10 M10 2 L2 10",
                        stroke: "currentColor",
                        "stroke-width": "1.8",
                        "stroke-linecap": "round"
                      })
                    ])
                  ], -1)
                ])]),
                _: 1
              }),
              createBaseVNode("div", _hoisted_1$1, [
                createBaseVNode("div", _hoisted_2$1, [
                  t.title ? (openBlock(), createBlock($setup["ToastTitle"], {
                    key: 0,
                    class: "text-xs leading-tight text-ap-dark-green uppercase"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(t.title), 1)
                    ]),
                    _: 2
                  }, 1024)) : createCommentVNode("", true),
                  createVNode($setup["ToastDescription"], { class: "text-sm leading-snug text-ap-dark-green" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(t.description), 1)
                    ]),
                    _: 2
                  }, 1024)
                ])
              ]),
              t.action ? (openBlock(), createElementBlock("div", _hoisted_3$1, [
                createVNode($setup["ToastAction"], {
                  "as-child": "",
                  "alt-text": t.action.altText
                }, {
                  default: withCtx(() => [
                    createBaseVNode("button", {
                      type: "button",
                      class: "rounded-full border border-ap-dark-green px-2.5 py-0.5 text-xs text-ap-dark-green transition-colors hover:bg-ap-light-green/30",
                      onClick: () => {
                        t.action?.onClick();
                        $setup.dismiss(t.id);
                      }
                    }, toDisplayString(t.action.label), 9, _hoisted_4$1)
                  ]),
                  _: 2
                }, 1032, ["alt-text"])
              ])) : createCommentVNode("", true)
            ]),
            _: 2
          }, 1032, ["open", "onUpdate:open", "duration", "type"]);
        }), 128)),
        createVNode($setup["ToastViewport"], { class: "fixed right-3 bottom-3 z-50 flex max-h-[calc(100vh-1.5rem)] w-[300px] max-w-[calc(100vw-1.5rem)] flex-col gap-1.5 outline-none" })
      ]),
      _: 1
    });
  }
  const Toaster = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-9286cb23"], ["__file", "AltPilotToaster.vue"]]);
  const ASSET_CARD_LIMIT = 36;
  const _sfc_main = /* @__PURE__ */ defineComponent({
    __name: "App",
    props: {
      cpTrigger: {},
      csrfToken: {},
      sites: {},
      primarySiteId: {},
      hasSelectedVolumes: { type: Boolean }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const state = useGlobalState();
      const { fetchAssets, query } = useAssets();
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get("query");
      if (queryParam) {
        query.value = queryParam;
      }
      state.csrfToken.value = __props.csrfToken;
      state.cpTrigger.value = __props.cpTrigger;
      state.sites.value = __props.sites;
      state.primarySiteId.value = __props.primarySiteId;
      state.hasSelectedVolumes.value = __props.hasSelectedVolumes;
      const { assets, assetIds, loading, pagination } = useAssets({
        defaultLimit: ASSET_CARD_LIMIT
      });
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
        const newOffset = Math.max(0, pagination.value.offset - pagination.value.limit);
        fetchAssets({ offset: newOffset, limit: pagination.value.limit });
      };
      const handleNext = () => {
        if (!pagination.value) return;
        const newOffset = pagination.value.offset + pagination.value.limit;
        fetchAssets({ offset: newOffset, limit: pagination.value.limit });
      };
      const handlePageChange = (page) => {
        if (!pagination.value) return;
        const newOffset = (page - 1) * pagination.value.limit;
        fetchAssets({ offset: newOffset, limit: pagination.value.limit });
      };
      const sortedAssets = computed(() => {
        return assetIds.value.map((id) => assets.value[id]).filter((asset) => asset !== void 0);
      });
      onMounted(() => {
        fetchAssets();
        fetchStatusCounts();
      });
      const __returned__ = { state, fetchAssets, query, urlParams, queryParam, ASSET_CARD_LIMIT, assets, assetIds, loading, pagination, fetchStatusCounts, showLoading, lightboxOpen, initialLightboxAssetId, openLightbox, handlePrevious, handleNext, handlePageChange, sortedAssets, AssetCard, AssetLightbox, AssetCardSkeleton, AssetPagination, AltPilotHeader, Toaster };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  const _hoisted_1 = { id: "altPilotWrapper" };
  const _hoisted_2 = {
    key: 0,
    class: "mb-6 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-800"
  };
  const _hoisted_3 = ["href"];
  const _hoisted_4 = { class: "relative" };
  const _hoisted_5 = {
    key: "loading",
    class: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6"
  };
  const _hoisted_6 = {
    key: "loaded",
    class: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6"
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return openBlock(), createElementBlock("div", _hoisted_1, [
      !$props.hasSelectedVolumes ? (openBlock(), createElementBlock("div", _hoisted_2, [
        createBaseVNode("p", null, [
          _cache[1] || (_cache[1] = createTextVNode(" No volumes selected. Please configure the ", -1)),
          createBaseVNode("a", {
            href: `/${$props.cpTrigger}/settings/plugins/altpilot`,
            class: "font-bold underline hover:text-yellow-900"
          }, "settings", 8, _hoisted_3),
          _cache[2] || (_cache[2] = createTextVNode(". ", -1))
        ])
      ])) : createCommentVNode("", true),
      createVNode($setup["AltPilotHeader"]),
      createBaseVNode("div", _hoisted_4, [
        createVNode(Transition, { name: "asset-grid-fade" }, {
          default: withCtx(() => [
            $setup.showLoading ? (openBlock(), createElementBlock("div", _hoisted_5, [
              (openBlock(), createElementBlock(Fragment, null, renderList($setup.ASSET_CARD_LIMIT, (i) => {
                return createBaseVNode("div", {
                  key: `skeleton-${i}`,
                  class: "h-full"
                }, [
                  createVNode($setup["AssetCardSkeleton"])
                ]);
              }), 64))
            ])) : (openBlock(), createElementBlock("div", _hoisted_6, [
              (openBlock(true), createElementBlock(Fragment, null, renderList($setup.assetIds, (id) => {
                return openBlock(), createElementBlock("div", {
                  key: id,
                  class: "h-full"
                }, [
                  $setup.assets[id] ? (openBlock(), createBlock($setup["AssetCard"], {
                    key: 0,
                    asset: $setup.assets[id],
                    onClickImage: $setup.openLightbox
                  }, null, 8, ["asset"])) : createCommentVNode("", true)
                ]);
              }), 128))
            ]))
          ]),
          _: 1
        })
      ]),
      !$setup.showLoading ? (openBlock(), createBlock($setup["AssetPagination"], {
        key: 1,
        pagination: $setup.pagination,
        onPrevious: $setup.handlePrevious,
        onNext: $setup.handleNext,
        onPageChange: $setup.handlePageChange
      }, null, 8, ["pagination"])) : createCommentVNode("", true),
      createVNode($setup["Toaster"]),
      createVNode($setup["AssetLightbox"], {
        open: $setup.lightboxOpen,
        "onUpdate:open": _cache[0] || (_cache[0] = ($event) => $setup.lightboxOpen = $event),
        "initial-asset-id": $setup.initialLightboxAssetId,
        assets: $setup.sortedAssets,
        "primary-site-id": $props.primarySiteId
      }, null, 8, ["open", "initial-asset-id", "assets", "primary-site-id"])
    ]);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cd34fbaf"], ["__file", "App.vue"]]);
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#altpilot-app").forEach((el) => {
      const props = JSON.parse(el.dataset.props || "{}");
      const app = createApp(App, props);
      app.mount(el);
    });
  });
})();
//# sourceMappingURL=main.js.map
