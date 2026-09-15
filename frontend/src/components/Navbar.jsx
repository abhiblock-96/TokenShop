import "../index.css";

const Navbar = (props) => {
  return (
    <div className="relative flex justify-between items-center p-[0.5em] text-white">
      <div>FomoShop</div>

      <div className="absolute left-1/2 -translate-x-1/2 flex gap-6 text-[#786F63]">
        <a>home</a>
        <a>$FBCK</a>
        <a>buy</a>
      </div>

      <div>
        <button
          className="bg-[#C96F4A] border-2 rounded-[1em] px-[1em] text-[#FFFFFF]"
          onClick={props.connection}
        >
          {props.address
            ? `${props.address.slice(0, 6)}...${props.address.slice(-4)}`
            : "connect"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
