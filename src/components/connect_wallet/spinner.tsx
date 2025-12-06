import GradientBox from "../shared/gradient_box";

const Spinner = () => {
  return (
    <GradientBox>
      <svg className="w-44 h-44 animate-spin" viewBox="0 0 100 100">
       <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#2e6a71"
          strokeWidth="10"
          fill="none"
          opacity="0.4"
        />

        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#00bcd4"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="80 220"
          strokeDashoffset="0"
        />
      </svg>
    </GradientBox>
  );
};

export default Spinner;
