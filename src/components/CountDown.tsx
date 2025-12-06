import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import { useReducer } from "react";

const Wrapper = styled("div")(({ theme }) => ({
  margin: "20px",
}));

const Countdown = (props: any) => {
  const [, timeUpdate] = useReducer((x) => x + 1, 0);

  var dateNow = new Date().getTime();
  var timeleft = props.dateEnd - dateNow;
  var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

  setInterval(function () {
    timeUpdate();
  }, 1000);

  return (
    <Wrapper sx={{ margin: "20px" }}>
      <Typography fontSize="14px" color="#898989" fontWeight="500">
        Reward claimable in
      </Typography>
      <Typography fontSize="14px" color="#898989" mt="3px">
        {days < 10 ? "0" : ""}
        {days} : {hours < 10 ? "0" : ""}
        {hours} : {minutes < 10 ? "0" : ""}
        {minutes} : {seconds < 10 ? "0" : ""}
        {seconds}
      </Typography>
    </Wrapper>
  );
}

export default Countdown;