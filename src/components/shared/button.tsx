import { motion } from "motion/react";
import { CgSpinner } from "react-icons/cg";


interface Props {
    text: string;
    onClick: () => void;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
}

const Button = ({ onClick, text, disabled, loading, className }: Props) => {
    return (
        <button
            className={`${className} w-[140px] h-[47px] bg-[#30B0C7] rounded-lg text-[16px] font-btn font-[500] text-[#FFFFFF] hover:bg-[#1A7B8C] transition duration-300 ease-in-out outline-none flex items-center justify-center `}
            disabled={disabled}
            style={{ opacity: disabled ? 0.5 : 1 }}
            type="button"
            onClick={onClick}
        >
            {loading ? (
                <motion.div
                    className="flex items-center justify-center"
                    animate={{
                    rotate: 360,
                    }}
                    transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                    }}
                >
                    <CgSpinner className="text-[40px] text-white" />
                </motion.div>
            ) : (
                <>{text}</>
            )}
        </button>
    );
}

export default Button;
