export default ({ input, label }) => {
	return (
		<div>
			<label>{label}</label>
			<input {...input} />
		</div>
	);
};
