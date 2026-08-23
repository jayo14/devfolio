export function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1326px] px-4 ${className}`}>
      {children}
    </div>
  );
}

export default Container;
