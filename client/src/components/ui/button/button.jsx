import { motion } from "framer-motion";

function Button({
    children,
    type = "button",
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
}) {

    const variants = {
        primary:
            "bg-blue-600 hover:bg-blue-700 text-white",

        secondary:
            "bg-slate-200 hover:bg-slate-300 text-slate-900",

        danger:
            "bg-red-600 hover:bg-red-700 text-white",

        success:
            "bg-green-600 hover:bg-green-700 text-white",
    };

    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
                w-full
                rounded-xl
                px-4
                py-3
                font-semibold
                transition-all
                duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
        >
            {children}
        </motion.button>
    );
}

export default Button;