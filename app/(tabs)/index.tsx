import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get("window").width;

export default function App() {
  const [btcData, setBtcData] = useState([]);
  const [inflation, setInflation] = useState(null);
  const [covidData, setCovidData] = useState(null);

  useEffect(() => {
    // Bitcoin chart
    fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7')
      .then(res => res.json())
      .then(json => {
        const prices = json.prices.map((p: any[]) => p[1]);
        setBtcData(prices);
      });

    // Global inflation (example: Chile)
    fetch('https://api.api-ninjas.com/v1/inflation?country=Chile', {
      headers: { 'X-Api-Key': '5C6+gpV0h8j4qk8SlRKD9g==r0da0QHY7chYBkUs' }
    })
      .then(res => res.json())
      .then(json => {
        setInflation(json[0].yearly_rate_pct);
      });

      // Covid API
      fetch('https://covid-api.com/api/reports/total?date=2020-05-10&iso=CHL')
        .then(res => res.json())
        .then(json => {
          console.log("json "+json);
          console.log("json.data "+json.data);
          console.log("json.data.date "+json.data.date);
          setCovidData(json.data);
        });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Dashboard Económico</Text>

      {/* Bitcoin */}
      <Text style={styles.sectionTitle}>Precio Bitcoin (USD últimos 7 días)</Text>
      {btcData.length > 0 && (
        <LineChart
          data={{
            labels: Array(7).fill(''),
            datasets: [{ data: btcData }]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#f5f5f5',
            backgroundGradientTo: '#f5f5f5',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
      )}

      {/* Inflation */}
      <Text style={styles.sectionTitle}>📉 Inflación anual (Chile)</Text>
      <Text style={styles.valueText}>
        {inflation !== null ? `${inflation} %` : 'Cargando...'}
      </Text>

      {/* covid */}
      <Text style={styles.sectionTitle}>📉 Datos Covid 19 10-05-2020 (Chile)</Text>
      <Text style={styles.valueText}>
      {covidData ? (
        <ul>
          {Object.entries(covidData).map(([key, value], index) => (
            <li key={`covid-${index}`}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      ) : (
        <p>Cargando datos...</p>
      )}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 30 },
  sectionTitle: { fontSize: 20, marginTop: 20, fontWeight: '600' },
  valueText: { fontSize: 18, marginTop: 5 },
  chart: { marginVertical: 10, borderRadius: 10 }
});
