import { BsFillDoorClosedFill, BsDoorOpenFill } from "react-icons/bs";
import { PiLockKeyBold, PiLockKeyOpen } from "react-icons/pi";

const LockAnimation = () => {
  return (
    <div className="lock-animation">
      <div className="spinner-box">
        <div className="circle-border">
          <div className="circle-core">
            <div className="door-container">
              <div className="door">
                <BsFillDoorClosedFill className="door-closed" size={200} />
                <BsDoorOpenFill className="door-open" size={200} />
              </div>
            </div>

            <div className="key-container">
              <PiLockKeyBold className="key-closed" size={100} />
              <PiLockKeyOpen className="key-open" size={100} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockAnimation;
