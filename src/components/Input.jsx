export default function Input({ value, onChange, placeholder = '', type = 'text', ...rest }) {
  return (
    <input value={value} onChange={onChange} placeholder={placeholder} type={type} {...rest} />
  );
}
