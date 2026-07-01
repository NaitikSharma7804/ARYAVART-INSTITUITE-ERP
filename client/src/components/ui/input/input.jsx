function Input({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
}) {
    return (
        <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    px-4
                    py-3
                    outline-none
                    focus:border-blue-600
                    focus:ring-4
                    focus:ring-blue-100
                    transition-all
                "
            />
        </div>
    );
}

export default Input;