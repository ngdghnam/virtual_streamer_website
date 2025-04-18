"use client";
import React from "react";
import EndSectionPhoneForm from "../Forms/EndSectionPhoneForm";

const EndSection = () => {
  return (
    <div className=" mt-6 p-4 bg-white shadow-lg rounded-lg mx-1">
      <h1 className="text-2xl font-medium">Lời cảm ơn và Giveaway</h1>
      <h2 className="text-xl font-medium">Cảm ơn bạn đã tham gia khảo sát!</h2>
      <p>
        Phản hồi của bạn là vô cùng quý báu và sẽ đóng góp thiết thực cho nghiên
        cứu của chúng tôi về thần tượng ảo.
      </p>
      <p>
        Để bày tỏ lòng biết ơn, chúng tôi tổ chức giveaway 2 giải thưởng trị giá{" "}
        <b>50.000đ</b> dành cho 2 bạn may mắn đã hoàn thành khảo sát.
      </p>
      <p>
        Bạn vui lòng để lại số điện thoại để chúng mình có thể liên hệ trao
        thưởng nếu bạn trúng giải nhé!
      </p>
      <div className="mt-4">
        <EndSectionPhoneForm></EndSectionPhoneForm>
      </div>
    </div>
  );
};

export default EndSection;
