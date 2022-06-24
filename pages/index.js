import React, { useState, useEffect, Fragment } from "react";
import { CashIcon, CodeIcon, LocationMarkerIcon, MapIcon } from '@heroicons/react/outline';
import {  SelectorIcon, CheckIcon } from '@heroicons/react/solid';
import { Listbox, Transition } from "@headlessui/react";
import { Head } from "next/head";
import JSONPretty from "react-json-pretty";


export default function Home() {
  const [usePointA, setPointA] = useState("");
  const [usePointB, setPointB] = useState("");
  const [useAvoidTolls, setAvoidTolls] = useState(false);
  const [useTransportMode, setTransportMode] = useState({ name: "Driving" });
  const [useJsonResult, setJsonResult] = useState();
  const [useIframeUrl, setIframeUrl] = useState("");
  const [useJson, setJson] = useState(0);
  const MapBaseURL = "https://www.google.com/maps/embed/v1/directions?"
  const JsonBaseURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";
  const Origins = "origins=";
  const Desintations = "Destinations=";
  const Origin = "origin=";
  const Destination = "&destination=";
  const Mode = "&mode=";
  const Key = "&key=";

  const TransportModes =
    [{ name: "Driving" },
    { name: "Public Transport" },
    { name: "Walking" },
    { name: "Cycling" },
    { name: "Flying" },
    ]

  function ModeToString(value){
    switch(value.name){
      case "Driving":
        return "driving";
      case "Public Transport":
        return "transit";
      case "Walking":
        return "walking";
      case "Cycling":
        return "bicycling";
      case "Flying":
        return "flying";
    }
  }

  function ModeToStringJSON(value){
    switch(value.name){
      case "Driving":
        return "DRIVING";
      case "Public Transport":
        return "TRANSIT";
      case "Walking":
        return "WALKING";
      case "Cycling":
        return "BICYCLING";
      case "Flying":
        return "FLYING";
    }
  }

  function AvoidTolls(){
    if(useAvoidTolls){
      return "&avoid=tolls";
    } else {
      return "";
    }
  }

  function Submit(){
    console.log(useAvoidTolls);
    fetchRoute();
    setIframeUrl(MapBaseURL+Origin+usePointA+Destination+usePointB+AvoidTolls()+Mode+ModeToString(useTransportMode)+Key+process.env.NEXT_PUBLIC_API_KEY);
  }

  function setTolls(){
    setAvoidTolls(document.getElementById("AvoidTolls").checked);
  }

  function changeJson(value){
    if(value === "json"){
      setJson(true);
    } else {
      setJson(false);
    }
  }

  function fetchRoute(){
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
    {
      origins: [usePointA],
      destinations: [usePointB],
      travelMode: ModeToStringJSON(useTransportMode),
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidTolls: useAvoidTolls,
    }, callback);
    }

    function callback(response, status){
      setJsonResult(response);
    }

  return (
    <div className="h-screen w-screen bg-blue-500 flex justify-center items-center">
      <script async
          src={"https://maps.googleapis.com/maps/api/js?key="+process.env.NEXT_PUBLIC_API_KEY}>
      </script>
      <div className="w-2/3 h-1/2 bg-white md:w-4/5 xl:w-2/3 md:h-3/4 rounded-lg shadow-lg shadow-blue-700 ring-1 ring-black ring-opacity-20 flex justify-between items-center p-4">
        <div id="InputPanel" className="h-full w-1/3 p-4 flex flex-col items-start gap-10">
          <div className="flex flex-row w-full items-center gap-5">
            <LocationMarkerIcon className="w-10 h-10 text-zinc-400" />
            <input className="h-10 w-full text-zinc-600 focus:outline-none text-xl font-default border-0 border-b-2 border-zinc-400 placeholder:text-zinc-400 outline-none form-input focus:ring-0" placeholder="Origin"
              onChange={(event) => setPointA(event.target.value)} type="text"></input>
          </div>
          <div className="flex flex-row w-full items-center gap-5">
            <LocationMarkerIcon className="w-10 h-10 text-zinc-400" />
            <input className="h-10 w-full text-zinc-600 focus:outline-none text-xl font-default border-0 border-b-2 border-zinc-400 placeholder:text-zinc-400 outline-none form-input focus:ring-0" placeholder="Destination"
              onChange={(event) => setPointB(event.target.value)} type="text"></input>
          </div>
          <div className="flex flex-row w-full items-center justify-between gap-5">
            <div className="flex flex-row items-center gap-5">
              <CashIcon className="w-10 h-10 text-zinc-400" />
              <h1 className="text-xl font-default text-zinc-400">Avoid Tolls?</h1>
            </div>
            <div className=" h-10 w-10">
              <input id="AvoidTolls" type="checkbox" className="h-10 w-10 checked:text-blue-500 rounded-lg form-input" onChange={() => setTolls()}></input>
            </div>
            
          </div>
          <div className="h-10 w-full">
            <Listbox value={useTransportMode} onChange={setTransportMode}>
              <div className="relative mt-1">
                <Listbox.Button className="h-10 ring-1 ring-black ring-opacity-10 relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate font-default text-lg">{useTransportMode.name}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ">
                    {TransportModes.map((mode, modeIdx) => (
                      <Listbox.Option
                        key={modeIdx}
                        className={({ active }) =>
                          `relative select-none py-2 pl-10 pr-4 cursor-pointer ${active ? 'bg-zinc-100 text-blue-500' : 'text-gray-900'
                          }`
                        }
                        value={mode}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate font-default text-lg ${selected ? 'font-medium' : 'font-normal'
                                }`}
                            >
                              {mode.name}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <div className="px-4 p-2 bg-blue-500 shadow-md shadow-zinc-400 cursor-pointer text-md font-default text-white rounded-md"
          onClick={() => Submit()}>
            SUBMIT
          </div>

        </div>
        <div id="MapPanel" className="h-full w-2/3 p-4">
          {useIframeUrl == "" ? (
            <div className="h-full w-full rounded-lg shadow-md shadow-zinc-500 bg-blue-400 flex items-center justify-center flex-col">
              <img src="/images/Standard.png" className="px-10 w-full h-fit object-contain"/>
              <MapIcon className="h-20 w-20 text-white" />
            </div>

          ) : (
            <div className="h-full w-full relative">
              {useJson ? (
                <div className="h-full w-full rounded-lg shadow-md shadow-zinc-500 ring-1 ring-black ring-opacity-20 z-20 bg-zinc-200/50 p-10">
                  <JSONPretty data={useJsonResult} keyStyle={"color:#E54101; "} mainStyle={"color:#444544; background-color:transparent"} valueStyle={"color:#04CB00;"} stringStyle={"color:#0175E5"}/>
                </div>
              ) : (<iframe src={useIframeUrl} className="h-full w-full rounded-lg shadow-md shadow-zinc-500 ring-1 ring-black ring-opacity-20 z-20" />)}
              <div className="absolute top-2 right-2 z-50 flex flex-row p-2 w-32 bg-white/80 h-10 rounded-md items-center justify-center gap-2">
                <div className={`group w-1/2 flex items-center justify-center rounded-md   transition-all ease-in-out duration-300 ${useJson ? "bg-blue-500" : "bg-transparent hover:bg-blue-300"}`}
                onClick={() => changeJson("json")}>
                  <CodeIcon className={`group h-8 w-8  cursor-pointer transition-all ease-in-out duration-300 ${useJson ? "text-white" : "text-zinc-600 group-hover:text-white"}`} />
                </div>
                <div className={`group w-1/2 flex items-center justify-center rounded-md   transition-all ease-in-out duration-300 ${!useJson ? "bg-blue-500" : "bg-transparent hover:bg-blue-300"}`}
                onClick={() => changeJson("nojson")}>
                  <MapIcon className={`group h-8 w-8  cursor-pointer transition-all ease-in-out duration-300 ${!useJson ? "text-white" : "text-zinc-600 group-hover:text-white"}`} />
                </div>
              </div>
            </div>
            
          )}
        </div>
      </div>
    </div>
  )
}
