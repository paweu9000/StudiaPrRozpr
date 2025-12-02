import type {Route} from "./+types/home";
import {HomePage} from "~/home/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "home", content: "Crud" },
  ];
}

export default function Home() {
  return <HomePage />;
}

