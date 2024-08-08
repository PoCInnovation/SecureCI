"use client";
import SecureCI from "../../../assets/secure-CI.png";
import Image from "next/image";
import { signIn } from "next-auth/react";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-2 lg:mt-10">
      <div className="mb-7">
        <Image
          src={SecureCI}
          width={200}
          height={200}
          alt="Secure-CI"
        />
      </div>
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Secure-CI
        <span className="text-1xl sm:text-3xl lg:text-5xl bg-gradient-to-r from-cyan-500 to-cyan-900 text-transparent bg-clip-text">
          {" "}
          <br></br>Continuous Integration, Continuous Security
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
      Empower your development process and secure your code effortlessly with our automated analysis tools. Get started today and protect your projects from vulnerabilities!
      </p>
      <div className="flex justify-center my-10 cursor-pointer">
        <a onClick={() => { signIn('github', { callbackUrl: "/dashboard"});} }
          className="dark:bg-cyan-800 border py-3 px-4 mx-3 rounded-md"
        >
          Get started
        </a>
        <a href="#" className="py-3 px-4 mx-3 rounded-md border">
          Documentation
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
