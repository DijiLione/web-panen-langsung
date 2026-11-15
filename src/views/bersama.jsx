export function Medan({ id, label, galat, penuh, petunjuk, children }) {
  return (
    <div className={`medan ${penuh ? 'medan-penuh' : ''} ${galat ? 'medan-galat' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {petunjuk ? <p className="petunjuk">{petunjuk}</p> : null}
      {galat ? (
        <p className="galat" id={`galat-${id}`}>
          {galat}
        </p>
      ) : null}
    </div>
  );
}

export function Pita({ children }) {
  return <div className="pita">{children}</div>;
}
