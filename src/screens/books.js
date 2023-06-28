import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../services";
const Books = ({ navigation }) => {
  const [list, setList] = useState({});
  const [skip, setSkip] = useState(0);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  useEffect(() => {
    fetchBooksList();
  }, [skip]);

  const fetchBooksList = () => {
    api
      .getBooks(`?skip=${skip}`)
      .then((response) => {
        setRefreshLoading(false);
        setLoadMore(false);
        if (skip === 0) {
          setList(response);
        } else {
          setList({ ...response, data: [...list.data, ...response.data] });
        }
      })
      .catch(() => {
        setRefreshLoading(false);
      });
  };
  const renderFooter = () =>
    loadMore ? (
      <View style={styles.footerView}>
        <ActivityIndicator size="small" color="#555" />
      </View>
    ) : (
      <View />
    );
  return (
    <SafeAreaView style={{ paddingBottom: 60 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Books</Text>
      </View>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshLoading}
            onRefresh={() => {
              setRefreshLoading(true);
              setSkip(0);
            }}
          />
        }
        onEndReached={() => {
          if (skip + 10 < list.total) {
            setSkip(10 + skip);
            setLoadMore(true);
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        numColumns={2}
        data={list.data}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Details", { info: item })}
            >
              <View style={styles.itemContainer}>
                <Image
                  style={styles.imageContainer}
                  resizeMode="cover"
                  source={{
                    uri: item.image[0],
                  }}
                />
              </View>
              <Text style={styles.textTilte}>{item.title}</Text>
              <View style={styles.itemInnerContainer}>
                <Text style={styles.textdiscount}>{item.discount}%</Text>
                <Text style={styles.textPrice}>{item.price}원</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "500",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
  },
  itemContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#edeef3",
    alignItems: "center",
    justifyContent: "center",
  },

  itemInnerContainer: {
    width: "100%",
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    paddingEnd: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textTilte: {
    marginStart: 13,
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  textdiscount: {
    color: "red",
    fontSize: 15,
    fontWeight: "600",
    marginStart: 15,
  },
  textPrice: {
    fontWeight: "700",
    alignSelf: "flex-end",
    color: "#000",
    fontSize: 18,
  },
  scrollBackground: { backgroundColor: "#fff" },
  card: { width: "50%", marginEnd: 4 },
  imageContainer: {
    width: "100%",
    height: 220,
  },
  footerView: {
    height: 100,
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
});
export default Books;
