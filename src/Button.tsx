//Componente compartido Button
export function Button({ label, onClick, disabled = false }){
    return (
        <button onClick={onClick} disabled={disabled} style={{ padding: '10px 20px', fontSize: '16px' }}>
            {label}
        </button>
    );
}