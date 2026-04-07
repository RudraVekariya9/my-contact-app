import React, { useState, useEffect } from "react";
import { 
  FlatList, 
  ActivityIndicator, 
  RefreshControl 
} from "react-native";
import styled from "styled-components/native";

const API_URL = "https://picsum.photos/v2/list";

export default function PaginationHome() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefreshing = false) => {
    if (loading) return;
    if (!isRefreshing && isEnd) return;

    setLoading(true);
    const currentPage = isRefreshing ? 1 : page;

    try {
      // Fetching with the 10 item limit you requested
      const response = await fetch(`${API_URL}?page=${currentPage}&limit=10`);
      const json = await response.json();

      if (json.length === 0) {
        setIsEnd(true);
      } else {
        setData(isRefreshing ? json : [...data, ...json]);
        setPage(currentPage + 1);
      }
    } catch (error) {
      console.error("Pagination Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setIsEnd(false);
    fetchData(true);
  };

  const renderItem = ({ item }) => (
    <Card>
      <Photo source={{ uri: `https://picsum.photos/id/${item.id}/400/250` }} />
      <InfoBox>
        <AuthorText>{item.author}</AuthorText>
        <IDText>Image ID: #{item.id}</IDText>
      </InfoBox>
    </Card>
  );

  const renderFooter = () => {
    if (!loading || refreshing) return null;
    return (
      <FooterContainer>
        <ActivityIndicator size="small" color="#0b74e5" />
        <LoadingText>Loading more...</LoadingText>
      </FooterContainer>
    );
  };

  return (
    <ListContainer>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        onEndReached={() => fetchData()}
        onEndReachedThreshold={0.5} 
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#0b74e5"]} 
          />
        }
      />
    </ListContainer>
  );
}

/* ---------- STRUCTURED STYLES ---------- */

const ListContainer = styled.View`
  flex: 1;
  background-color: #f5f7fa;
`;

const Card = styled.View`
  background-color: #ffffff;
  margin: 12px 16px;
  border-radius: 12px;
  overflow: hidden;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const Photo = styled.Image`
  width: 100%;
  height: 200px;
  background-color: #e1e4e8;
`;

const InfoBox = styled.View`
  padding: 12px;
`;

const AuthorText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #1a1a1a;
`;

const IDText = styled.Text`
  font-size: 12px;
  color: #777;
  margin-top: 4px;
`;

const FooterContainer = styled.View`
  padding: 20px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const LoadingText = styled.Text`
  margin-left: 10px;
  color: #0b74e5;
  font-size: 14px;
`;