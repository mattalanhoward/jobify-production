const FormTextArea = ({ type, value, name, rows, handleChange, labelText }) => {
	return (
		<div className="form-row">
			<label htmlFor={name} className="form-label">
				{labelText || name}
			</label>
			<textarea
				type={type}
				value={value}
				name={name}
				// rows={rows}
				onChange={handleChange}
				className="form-input form-textarea"
			/>
		</div>
	);
};
export default FormTextArea;
