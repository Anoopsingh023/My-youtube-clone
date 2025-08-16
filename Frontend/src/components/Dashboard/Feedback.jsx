import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/logo.jpg";
// import emailjs from "emailjs-com";
import emailjs from "@emailjs/browser"

const Feedback = () => {
    const [isLoading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)

    emailjs
      .send(
        "service_j4smnw8",   // Replace with your EmailJS Service ID
        "template_p79fzr5",  // Replace with your EmailJS Template ID
        formData,
        "rl85qMlwuLvALCyvZ"    // Replace with your EmailJS Public Key
      )
      .then(
        () => {
          toast.success("Feedback sent successfully!");
          setFormData({ name: "", email: "", rating: "", message: "" });
          setLoading(false)
        },
        (error) => {
          toast.error("Failed to send feedback. Try again later!");
        //   console.error("EmailJS Error:", error);
          setLoading(false)
        }
      );
  };

  return (
    <div className="flex items-center justify-center   p-4">
      <div className="bg-[#313131] shadow-lg rounded-2xl w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          We Value Your Feedback
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414141]"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414141]"
            required
          />

          {/* Rating */}
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414141]"
            required
          >
            <option className="bg-[#414141]" value="">
              Rate Us
            </option>
            <option className="bg-[#414141]" value="5">
              ⭐⭐⭐⭐⭐ Excellent
            </option>
            <option className="bg-[#414141]" value="4">
              ⭐⭐⭐⭐ Good
            </option>
            <option className="bg-[#414141]" value="3">
              ⭐⭐⭐ Average
            </option>
            <option className="bg-[#414141]" value="2">
              ⭐⭐ Poor
            </option>
            <option className="bg-[#414141]" value="1">
              ⭐ Very Poor
            </option>
          </select>

          {/* Message */}
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your feedback..."
            rows="4"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414141]"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 transition-all rounded-lg py-2 text-white font-medium shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
