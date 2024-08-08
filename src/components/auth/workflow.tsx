import { CheckCircle2 } from "lucide-react";
import codeImg from "../../../assets/code.jpg";
import { checklistItems } from "../../constants";
import Image from "next/image";

const Workflow = () => {
  return (
    <div className="mt-20">
      <h2 className="mb-7 text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide pb-5">
        Streamline your{" "}
        <span className="bg-gradient-to-r from-cyan-500 to-cyan-800 text-transparent bg-clip-text">
          development process.
        </span>
      </h2>
      <div className="flex flex-wrap justify-center">
        <div className="p-2 w-full lg:w-1/2 border">
          <Image src={codeImg} alt="Coding" />
        </div>
        <div className="pt-12 w-full lg:w-1/2">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex mb-12">
              <div className="text-green-400 mx-6 h-10 w-10 p-2 justify-center items-center rounded-full">
                <CheckCircle2 />
              </div>
              <div>
                <h5 className="mt-1 mb-2 text-xl">{item.title}</h5>
                <p className="text-md text-neutral-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workflow;
