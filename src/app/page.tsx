import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {

  const arr = [
    {"name" : "tarkov",
      "value" : 300,
      "id" : 1
    },
    {"name" : "bebra",
      "value" : 200,
      "id" : 2
    },
    {"name" : "amogus",
      "value" : 100,
      "id" : 3
    },
  ]

  return (
    <div className={styles.page}>
      {arr.map(item => {
        <Row name={item.name} value={item.value} onDelete={() => {}}/>
      })}
      
    </div>
  );
}

function Row({name, value, onDelete}) {
  return <div>
    <p>{name}</p>
    <p>{value}</p>
    <button onClick={() => {onDelete}}/>
  </div>
}
