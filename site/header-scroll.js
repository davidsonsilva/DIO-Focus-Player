(() => {
  const header = document.querySelector(".topbar");
  const page = document.querySelector(".page");

  if (!header || !page) {
    return;
  }

  const compactBreakpoint = 960;
  const animationDistance = 760;
  const iconSize = 62;
  const sidebarWidth = 184;
  const sidebarRailWidth = 208;
  const edgeSpacing = 16;

  let ticking = false;

  const clamp = (value, minimum = 0, maximum = 1) =>
    Math.min(Math.max(value, minimum), maximum);

  const lerp = (start, end, progress) =>
    start + (end - start) * progress;

  const segment = (progress, start, end) =>
    clamp((progress - start) / (end - start));

  const smoothstep = (progress) =>
    progress * progress * (3 - 2 * progress);

  const px = (value) => `${value.toFixed(2)}px`;

  const setProperty = (name, value) => {
    header.style.setProperty(name, value);
  };

  const resetDesktopStyles = () => {
    header.classList.remove("is-cinematic", "is-sidebar-layout");
    page.classList.remove("has-cinematic-header");
    header.removeAttribute("style");
  };

  const renderCompactHeader = () => {
    resetDesktopStyles();
    header.classList.toggle("is-collapsed", window.scrollY > 48);
  };

  const renderCinematicHeader = () => {
    const content = page.querySelector("main");
    const contentRect = content.getBoundingClientRect();
    const pageLeft = contentRect.left;
    const pageWidth = contentRect.width;
    const railLeft = Math.max(pageLeft - sidebarRailWidth, edgeSpacing);
    const progress = clamp(window.scrollY / animationDistance);

    const collapse = smoothstep(segment(progress, 0, 0.22));
    const shrink = smoothstep(segment(progress, 0.22, 0.58));
    const expand = smoothstep(segment(progress, 0.58, 1));

    const collapsedHeight = lerp(78, iconSize, collapse);
    const shrinkingWidth = lerp(pageWidth, iconSize, shrink);
    const sidebarHeight = Math.min(
      430,
      Math.max(300, window.innerHeight - 32)
    );

    let width = pageWidth;
    let height = collapsedHeight;
    let x = pageLeft;

    if (progress >= 0.22 && progress < 0.58) {
      width = shrinkingWidth;
      height = iconSize;
      x = pageLeft;
    } else if (progress >= 0.58) {
      width = lerp(iconSize, sidebarWidth, expand);
      height = lerp(iconSize, sidebarHeight, expand);
      x = lerp(pageLeft, railLeft, expand);
    }

    const horizontalOpacity = 1 - smoothstep(segment(progress, 0.06, 0.24));
    const sidebarOpacity = smoothstep(segment(progress, 0.72, 0.96));
    const translucencyCurve = Math.sin(Math.PI * progress);
    const cinematicOpacity = 0.74 - (0.28 * translucencyCurve);
    const cinematicBlur = lerp(7, 3, translucencyCurve);
    const cinematicShadowOpacity = lerp(0.3, 0.16, translucencyCurve);
    const brandSize = progress < 0.58
      ? lerp(46, 38, collapse)
      : lerp(38, 46, expand);

    header.classList.add("is-cinematic");
    header.classList.toggle("is-collapsed", progress >= 0.08);
    header.classList.toggle("is-sidebar-layout", progress >= 0.58);
    page.classList.add("has-cinematic-header");

    setProperty("--cinematic-x", px(x));
    setProperty("--cinematic-y", "16px");
    setProperty("--cinematic-width", px(width));
    setProperty("--cinematic-height", px(height));
    setProperty("--cinematic-padding", px(lerp(16, 8, collapse)));
    setProperty("--cinematic-gap", px(lerp(20, 0, collapse)));
    setProperty("--cinematic-radius", px(lerp(24, 20, collapse)));
    setProperty("--cinematic-opacity", cinematicOpacity.toFixed(3));
    setProperty("--cinematic-blur", px(cinematicBlur));
    setProperty(
      "--cinematic-shadow-opacity",
      cinematicShadowOpacity.toFixed(3)
    );
    setProperty("--brand-size", px(brandSize));
    setProperty("--brand-gap", px(lerp(12, 0, collapse)));
    setProperty(
      "--horizontal-content-width",
      horizontalOpacity > 0 ? "1000px" : "0px"
    );
    setProperty("--horizontal-content-opacity", horizontalOpacity.toFixed(3));
    setProperty(
      "--horizontal-content-shift",
      px(lerp(0, 12, 1 - horizontalOpacity))
    );
    setProperty("--sidebar-content-opacity", sidebarOpacity.toFixed(3));
    setProperty(
      "--sidebar-content-shift",
      px(lerp(-10, 0, sidebarOpacity))
    );
    setProperty(
      "--nav-pointer-events",
      progress < 0.05 || progress > 0.96 ? "auto" : "none"
    );

  };

  const render = () => {
    if (window.innerWidth <= compactBreakpoint) {
      renderCompactHeader();
    } else {
      renderCinematicHeader();
    }

    ticking = false;
  };

  const requestRender = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(render);
  };

  render();
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender);
})();
