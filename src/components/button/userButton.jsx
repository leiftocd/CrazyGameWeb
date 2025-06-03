import userImg from '../../../public/image/user/user.jpg';
function UserButton({ onClick }) {
    return (
        <div className="flex items-center justify-center h-[40px] w-[40px] cursor-pointer max-sm:h-[35px] max-sm:w-[35px]">
            <button className="flex items-center justify-center w-full h-full group cursor-pointer" onClick={onClick}>
                <img src={userImg} alt="user" className="w-full h-full object-cover rounded-[50%]" />
            </button>
        </div>
    );
}

export default UserButton;
