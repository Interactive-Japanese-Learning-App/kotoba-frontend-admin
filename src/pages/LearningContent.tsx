import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import api from "../services/api";

type CategoryType = {
  name: string;
  icon: string;
};

function LearningContent() {

  const navigate = useNavigate();

  const [categories, setCategories] =
    useState<CategoryType[]>([]);

  const [loading, setLoading] =
    useState(true);

  //
  // ICON MAPPING
  //
  const getIcon = (
    category: string
  ) => {

    const icons: any = {
      hiragana: "あ",
      katakana: "カ",
      numbers: "1",
      months: "月",
      dates: "日",
      animals: "動",
      foods: "食",
      drinks: "茶",
      family: "家",
      jobs: "仕",
    };

    return (
      icons[category] || "日"
    );
  };

  //
  // FETCH CATEGORY
  //
  const fetchCategories =
    async () => {

      try {

        const response =
          await api.get(
            "/learning/categories"
          );

        const formatted =
          response.data.categories.map(
            (item: string) => ({
              name: item,
              icon: getIcon(item),
            })
          );

        setCategories(formatted);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

  useEffect(() => {

    fetchCategories();

  }, []);

  return (
    <AdminLayout>

      <div className="page-container">

        {/* HEADER */}
        <div>

          <h1 className="page-title">
            Konten Pembelajaran
          </h1>

          <p className="page-subtitle">
            Semua materi dari MongoDB
          </p>

        </div>

        {/* GRID */}
        {loading ? (

          <p>Loading...</p>

        ) : (

          <div
            className="
              grid
              grid-cols-4
              gap-5
              mt-6
            "
          >

            {categories.map(
              (item) => (

                <div
                  key={item.name}
                  onClick={() =>
                    navigate(
                      `/learning-content/${item.name}`
                    )
                  }
                  className="
                    bg-white
                    rounded-2xl
                    p-5
                    shadow-sm
                    border
                    cursor-pointer
                    hover:shadow-md
                    transition
                  "
                >

                  <div
                    className="
                      w-[70px]
                      h-[70px]
                      rounded-2xl
                      bg-[#eef3f7]
                      flex
                      items-center
                      justify-center
                      text-[30px]
                      font-bold
                      text-[#264d6d]
                    "
                  >
                    {item.icon}
                  </div>

                  <h2
                    className="
                      mt-4
                      text-[18px]
                      font-bold
                      capitalize
                    "
                  >
                    {item.name}
                  </h2>

                </div>
              )
            )}

          </div>
        )}

      </div>

    </AdminLayout>
  );
}

export default LearningContent;