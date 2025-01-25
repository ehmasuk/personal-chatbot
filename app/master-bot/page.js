import MasterChatBox from "@/components/MasterChatBox";

function page() {
    return (
        <div>
            <div
                style={{ backgroundColor: "#fafafa", opacity: 1, backgroundImage: "radial-gradient(#001aff 0.5px, #fafafa 0.5px)", backgroundSize: "10px 10px" }}
                className="w-full md:p-10 p-2 flex flex-col items-center justify-center border border-gray-200 rounded-lg"
            >
                <div className="z-20 h-[70vh] w-full md:max-w-md">
                    <MasterChatBox />
                </div>
            </div>
        </div>
    );
}

export default page;
