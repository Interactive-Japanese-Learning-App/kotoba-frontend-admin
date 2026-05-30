import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import api from "../services/api";

function LearningDetail() {

  const { type } = useParams();

  const [data, setData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  //
  // FETCH
  //
  const fetchData =
    async () => {

      try {

        const response =
          await api.get(
            `/learning/${type}`
          );

        setData(
          response.data.data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    fetchData();

  }, [type]);

  return (
    <AdminLayout>

      <div className="page-container">

        <div>

          <h1 className="page-title capitalize">
            {type}
          </h1>

          <p className="page-subtitle">
            Total {data.length} data
          </p>

        </div>

        <div className="card mt-6">

          {loading ? (

            <p>Loading...</p>

          ) : (

            <table className="w-full">

              <thead>

                <tr className="bg-[#f9fafb]">

                  <th className="table-head">
                    Character
                  </th>

                  <th className="table-head">
                    Hiragana
                  </th>

                  <th className="table-head">
                    Romaji
                  </th>

                  <th className="table-head">
                    Meaning
                  </th>

                </tr>

              </thead>

              <tbody>

                {data.map((item) => (

                  <tr
                    key={item._id}
                    className="table-row"
                  >

                    <td className="table-cell">
                      {item.character || "-"}
                    </td>

                    <td className="table-cell">
                      {item.hiragana || "-"}
                    </td>

                    <td className="table-cell">
                      {item.romaji || "-"}
                    </td>

                    <td className="table-cell">
                      {item.meaning || "-"}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </AdminLayout>
  );
}

export default LearningDetail;