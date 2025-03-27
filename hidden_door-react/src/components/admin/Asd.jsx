import { useEffect, useState } from "react";

const Asd = () => {
  const [data, setData] = useState([]);
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState({
    data: true,
    book: true
  });

  const handleData = async () => {
    try {
      const res = await fetch("...");
      if (!res.ok) throw new Error("Data fetch failed");
      setData(await res.json());
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, data: false }));
    }
  };

  const handleBook = async () => {
    try {
      const res = await fetch("...");
      if (!res.ok) throw new Error("Book fetch failed");
      setBook(await res.json());
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading((prev) => ({ ...prev, book: false }));
    }
  };

  useEffect(() => {
    handleData();
    handleBook();
  }, []);

  return (
    <div>
      <div>
        {loading.data ? (
          <div>데이터를 불러오는 중입니다.</div>
        ) : (
          data.map((d) => <div key={d.id}>{d.id}</div>)
        )}
      </div>

      <div>
        {loading.book ? (
          <div>책 정보를 불러오는 중입니다.</div>
        ) : (
          book.map((b) => <div key={b.id}>{b.id}</div>)
        )}
      </div>
    </div>
  );
};

export default Asd;
