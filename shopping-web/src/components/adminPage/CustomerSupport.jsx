import React, { useEffect, useState } from "react";
import CustomerFAQ from "./CustomerFAQ";
import AdminLayout from "./AdminLayout";

function CustomerSupport() {
  // FAQ 추가 함수
  const addFAQ = (question, answer) => {
    const newFAQ = { id: faqs.length + 1, question, answer };
    setFaqs([...faqs, newFAQ]);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">고객 지원(자주묻는질문)</h2>

        <CustomerFAQ />
      </div>
    </AdminLayout>
  );
}

export default CustomerSupport;
