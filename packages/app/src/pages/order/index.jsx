import React, {useState, useEffect} from 'react';
import {LadifyToolbar} from '@ladify/core'
import logic from "../../business/order"

export default function () {

  const [json, setJson] = useState(null);
  useEffect(() => {
    let getcode = async () => {
      let url = 'http://localhost:8081/getLayout?pageId=order';
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache'
        });
        const content = await response.json();
        setJson(content);

      } catch (e) {
        console.log(e)
      }

    }
    getcode();
  }, [])
  return (
    (
      json ? (<LadifyToolbar
        layoutJson={json}
        logic={new logic()}
        pageId="order"
        debug="ture">
      </LadifyToolbar>) : ""
    )
  );
}

