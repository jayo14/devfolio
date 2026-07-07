export function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-[73px] ${className}`}>
      {children}
    </div>
  );
}

export default Container;
