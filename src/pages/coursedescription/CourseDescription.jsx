import React, { useEffect, useState } from "react";
import logo from "../../assets/fonts/logo.jpg";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import toast from "react-hot-toast";
import axios from "axios";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();

  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    const {
      data: { order },
    } = await axios.post(
      `${server}/api/course/checkout/${params.id}`,
      {},
      {
        headers: {
          token,
        },
      }
    );

    const options = {
      key: "rzp_test_h5kv8xUMuEV0Ii", // Enter the Key ID generated from the Dashboard
      amount: order.id, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "Gurukul", //your business name
      description: "Learn with us",
      image: logo,
      order_id: order.id,

      handler: async function (response) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;
        try {
          const { data } = await axios.post(
            `${server}/api/verification/${params.id}`,
            {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
            {
              headers: {
                token,
              },
            }
          );

          await fetchUser();
          await fetchCourses();
          await fetchMyCourse();
          toast.success(data.message);
          setLoading(false);
          navigate(`/payment-success/${razorpay_payment_id}`);
        } catch (error) {
          toast.error(error.response.data.message);
          setLoading(false);
        }
      },
      theme: {
        color: "#052a50",
      },
    };
    const razorpay = new window.Razorpay(options);

    razorpay.open();
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="course-description">
              <div className="course-contain">
                <div className="course-header">
                  <img
                    src={`${server}/${course.image}`}
                    alt=""
                    className="course-imagee"
                  />
                  <div className="course-info">
                    <h2>{course.title}</h2>
                    <p>Instructor: {course.createdBy}</p>
                    <p>Duration: {course.duration} weeks</p>
                  </div>

                  <p>{course.description}</p>

                  <p>Lets get started with this course At ₹{course.price}</p>

                  {user && user.subscription.includes(course._id) ? (
                    <button
                      onClick={() => navigate(`/course/study/${course._id}`)}
                      className="comman-bttn"
                    >
                      Study
                    </button>
                  ) : (
                    <button onClick={checkoutHandler} className="comman-bttn">
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;
