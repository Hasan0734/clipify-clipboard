
import Clipboards from "../Clipboards";
import CustomLayout from "../CustomLayout";
import ClipboardHeader from "../ClipboardHeader";

const ClipboardApp = () => {
  return (
    <CustomLayout>
      <ClipboardHeader />
      <div className="flex flex-1 flex-col relative">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Clipboards />
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default ClipboardApp;
