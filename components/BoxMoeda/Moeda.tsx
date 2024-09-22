import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { MainStyles } from "@/styles/main";
import Reload from "../icon/Reload";
import Trash from "../icon/Trash";
import { getValorCotacao } from "@/services/getCotacao";

interface Prop {
  title: string;
  value: string;
  high: string;
  low: string;
  timestamp: string;
  varBid: number;
}

export interface PropMoeda {
  Code: string;
  handleDelete: (Code: string) => void;
}

export default function Moeda({ Code, handleDelete }: PropMoeda) {
  const [data, setData] = useState<Prop>();
  const [IsConverted, setIsConverted] = useState(false);

  async function dataGet() {
    getValorCotacao({ Code: Code }).then((res) => {
      const key = Object.keys(res).find((k) => k.startsWith(Code));

      if (key) {
        const exchangeData = res[key];
        console.log(exchangeData);
        setData({
          title: `${exchangeData.code} - ${exchangeData.codein}`,
          value: parseFloat(exchangeData.ask).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          high: parseFloat(exchangeData.high).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          low: parseFloat(exchangeData.low).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
          timestamp: exchangeData.create_date,
          varBid: parseFloat(parseFloat(exchangeData.pctChange).toFixed(2)),
        });
      }
    });
    return;
  }

  const handleUpdate = () => {
    dataGet();
  };

  useEffect(() => {
    dataGet();
  }, [Code]);

  return (
    <>
      {!!data ? (
        <View style={{ ...MainStyles.container_item, ...MainStyles.Shadown }}>
          <View style={{ ...MainStyles.flex, justifyContent: "space-between" }}>
            <Text style={MainStyles.Text_title}>{data.title}</Text>
            {data.varBid > 0 ? (
              <Text
                style={{
                  ...MainStyles.Text_green,
                }}
              >
                +{data.varBid}%
              </Text>
            ) : (
              <Text
                style={{
                  ...MainStyles.Text_red,
                }}
              >
                {data.varBid}%
              </Text>
            )}
          </View>

          <Text style={{ ...MainStyles.Text_primary, fontSize: 30 }}>
            {data.value}
          </Text>

          <Trash
            onPress={() => {
              handleDelete(Code);
            }}
          />
        </View>
      ) : (
        <View>
          <Text style={MainStyles.Text_primary}>Loading...</Text>
          <Trash
            onPress={() => {
              handleDelete(Code);
            }}
          />
          <Reload onPress={handleUpdate} />
        </View>
      )}
    </>
  );
}
