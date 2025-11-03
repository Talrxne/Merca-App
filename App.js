import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import * as Print from "expo-print";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

// --------------------- VENDAS ---------------------
function VendasScreen() {
  const [vendas, setVendas] = useState([]);
  const [valor, setValor] = useState("");
  const [metodo, setMetodo] = useState(null);

  const registrarVenda = () => {
    if (!valor || !metodo) {
      Alert.alert("Atenção", "Informe o valor e o método de pagamento.");
      return;
    }
    const novaVenda = {
      id: Date.now(),
      data: new Date().toLocaleDateString("pt-BR"),
      valor: parseFloat(valor),
      metodo,
    };
    setVendas([...vendas, novaVenda]);
    setValor("");
    setMetodo(null);
  };

  const totalMes = vendas.reduce((sum, v) => sum + v.valor, 0);
  const totalPix = vendas.filter(v => v.metodo === "Pix").reduce((s, v) => s + v.valor, 0);
  const totalDinheiro = vendas.filter(v => v.metodo === "Dinheiro").reduce((s, v) => s + v.valor, 0);
  const totalCartao = vendas.filter(v => v.metodo === "Cartão").reduce((s, v) => s + v.valor, 0);

  const exportarRelatorioPDF = async () => {
    const html = `
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <div style="text-align: center;">
            <img src="https://i.imgur.com/DKBNEmZ.png" width="80" />
            <h1 style="color: #3ddc84;">Merca APP</h1>
            <h2>Relatório de Vendas Mensal</h2>
            <p><strong>Período:</strong> ${new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
          </div>
          <hr/>
          <table border="1" style="width:100%; border-collapse: collapse; margin-top: 20px;">
            <tr style="background-color:#3ddc84; color:white;">
              <th>Data</th>
              <th>Valor</th>
              <th>Método</th>
            </tr>
            ${vendas
              .map(
                (v) => `
              <tr>
                <td style="text-align:center;">${v.data}</td>
                <td style="text-align:right;">R$ ${v.valor.toFixed(2)}</td>
                <td style="text-align:center;">${v.metodo}</td>
              </tr>`
              )
              .join("")}
          </table>
          <h3 style="margin-top: 20px;">Resumo Financeiro:</h3>
          <ul>
            <li><strong>Total Pix:</strong> R$ ${totalPix.toFixed(2)}</li>
            <li><strong>Total Dinheiro:</strong> R$ ${totalDinheiro.toFixed(2)}</li>
            <li><strong>Total Cartão:</strong> R$ ${totalCartao.toFixed(2)}</li>
          </ul>
          <h2 style="color:#3ddc84;">Total Geral: R$ ${totalMes.toFixed(2)}</h2>
          <p style="text-align:center; font-size:12px; margin-top:30px;">Relatório gerado automaticamente pelo Merca APP.</p>
        </body>
      </html>
    `;
    await Print.printAsync({ html });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💰 Vendas do Mês</Text>

      <TextInput
        style={styles.input}
        placeholder="Valor da venda (R$)"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      <View style={styles.paymentContainer}>
        {["Pix", "Dinheiro", "Cartão"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setMetodo(item)}
            style={[
              styles.paymentButton,
              metodo === item && { backgroundColor: "#3ddc84" },
            ]}
          >
            <Text style={{ color: metodo === item ? "#fff" : "#333" }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={registrarVenda}>
        <Text style={styles.buttonText}>Registrar Venda</Text>
      </TouchableOpacity>

      <FlatList
        data={vendas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.data}</Text>
            <Text>R$ {item.valor.toFixed(2)}</Text>
            <Text>{item.metodo}</Text>
          </View>
        )}
      />

      <View style={styles.summary}>
        <Text>Total do mês: R$ {totalMes.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={exportarRelatorioPDF}>
        <Text style={styles.exportText}>📄 Exportar Relatório (PDF)</Text>
      </TouchableOpacity>
    </View>
  );
}

// --------------------- ESTOQUE ---------------------
function EstoqueScreen() {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: "Fone com fio", quantidade: 10 },
    { id: 2, nome: "Fone sem fio", quantidade: 8 },
    { id: 3, nome: "Carregador", quantidade: 15 },
    { id: 4, nome: "Controle remoto", quantidade: 12 },
  ]);
  const [novoProduto, setNovoProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const adicionarProduto = () => {
    if (!novoProduto || !quantidade) {
      Alert.alert("Atenção", "Preencha o nome e a quantidade do produto.");
      return;
    }
    const novo = {
      id: Date.now(),
      nome: novoProduto,
      quantidade: parseInt(quantidade),
    };
    setProdutos([...produtos, novo]);
    setNovoProduto("");
    setQuantidade("");
  };

  const atualizarEstoque = (id, delta) => {
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantidade: Math.max(p.quantidade + delta, 0) } : p
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Controle de Estoque</Text>

      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 5 }]}
          placeholder="Novo produto"
          value={novoProduto}
          onChangeText={setNovoProduto}
        />
        <TextInput
          style={[styles.input, { width: 80 }]}
          placeholder="Qtd"
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={adicionarProduto}>
        <Text style={styles.buttonText}>Adicionar Produto</Text>
      </TouchableOpacity>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nome}</Text>
            <Text>Qtd: {item.quantidade}</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => atualizarEstoque(item.id, 1)}>
                <Ionicons name="add-circle" size={24} color="#3ddc84" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => atualizarEstoque(item.id, -1)}>
                <Ionicons name="remove-circle" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// --------------------- AGENDAMENTOS ---------------------
function AgendamentosScreen() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [descricao, setDescricao] = useState("");

  const adicionarAgendamento = () => {
    if (!nome || !data || !hora || !descricao) {
      Alert.alert("Atenção", "Preencha todos os campos do agendamento.");
      return;
    }
    const novo = { id: Date.now(), nome, data, hora, descricao };
    setAgendamentos([...agendamentos, novo]);
    setNome("");
    setData("");
    setHora("");
    setDescricao("");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📅 Agendamentos</Text>

      <TextInput style={styles.input} placeholder="Nome do cliente" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Data (dd/mm/aaaa)" value={data} onChangeText={setData} />
      <TextInput style={styles.input} placeholder="Hora" value={hora} onChangeText={setHora} />
      <TextInput style={styles.input} placeholder="Descrição / Equipamento" value={descricao} onChangeText={setDescricao} />

      <TouchableOpacity style={styles.button} onPress={adicionarAgendamento}>
        <Text style={styles.buttonText}>+ Adicionar Agendamento</Text>
      </TouchableOpacity>

      {agendamentos.map((a) => (
        <View key={a.id} style={styles.item}>
          <Text>{a.nome}</Text>
          <Text>{a.data} - {a.hora}</Text>
          <Text>{a.descricao}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

// --------------------- APP ---------------------
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#3ddc84",
          tabBarInactiveTintColor: "#777",
          tabBarStyle: { backgroundColor: "#f9f9f9" },
          tabBarIcon: ({ color, size }) => {
            let icon;
            if (route.name === "Vendas") icon = "cash-outline";
            else if (route.name === "Estoque") icon = "cube-outline";
            else if (route.name === "Agendamentos") icon = "calendar-outline";
            return <Ionicons name={icon} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Vendas" component={VendasScreen} />
        <Tab.Screen name="Estoque" component={EstoqueScreen} />
        <Tab.Screen name="Agendamentos" component={AgendamentosScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", color: "#3ddc84", marginBottom: 15, textAlign: "center" },
  input: { backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: "#ddd" },
  button: { backgroundColor: "#3ddc84", padding: 12, borderRadius: 10, marginVertical: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  item: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#fff", padding: 10, marginVertical: 5, borderRadius: 10 },
  summary: { marginTop: 10, padding: 10, backgroundColor: "#e8f9ef", borderRadius: 10 },
  paymentContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  paymentButton: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, width: 90, alignItems: "center" },
  exportButton: { backgroundColor: "#333", padding: 12, borderRadius: 10, marginTop: 20 },
  exportText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
