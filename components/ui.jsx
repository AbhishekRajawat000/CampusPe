import Image from "next/image";

export function Icon({ id, className = "" }) {
  return (
    <span className={`icon ${className}`} aria-hidden="true">
      <img src={`/assets/${id}.svg`} alt="" />
    </span>
  );
}

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  arrow = false,
  ...props
}) {
  const classes = `button button--${variant} ${className}`;
  const content = (
    <>
      {children}
      {arrow && <Icon id="1-1174" className="button-arrow" />}
    </>
  );
  return href ? (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={classes} {...props}>
      {content}
    </button>
  );
}

export function Eyebrow({ children, className = "" }) {
  return (
    <span className={`eyebrow ${className}`}>
      <span className="status-dot" />
      {children}
    </span>
  );
}

export function Chip({ children, tone = "slate", icon, className = "" }) {
  return (
    <span className={`chip chip--${tone} ${className}`}>
      {icon && <Icon id={icon} />}
      {children}
    </span>
  );
}

export function OriginalImage({
  hash,
  width,
  height,
  alt,
  className = "",
  style,
  priority = false,
}) {
  return (
    <Image
      src={`/assets/${hash}.webp`}
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={style}
      priority={priority}
    />
  );
}

export function CroppedImage({
  hash,
  width,
  height,
  alt,
  transform,
  priority = false,
  className = "",
}) {
  const [[sx, , tx], [, sy, ty]] = transform;
  return (
    <span
      className={`cropped-image ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <OriginalImage
        hash={hash}
        width={width}
        height={height}
        alt={alt}
        priority={priority}
        style={{
          width: `${100 / sx}%`,
          height: `${100 / sy}%`,
          left: `${(-tx / sx) * 100}%`,
          top: `${(-ty / sy) * 100}%`,
        }}
      />
    </span>
  );
}
