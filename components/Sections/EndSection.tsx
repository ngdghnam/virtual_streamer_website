"use client";
import React from "react";
// import EndSectionPhoneForm from "../Forms/EndSectionPhoneForm";
import { useSurveyContext } from "@/contexts/SurveyContext";
// import Link from "next/link";

const EndSection: React.FC = () => {
  const { isSurveyCompleted } = useSurveyContext();

  // Don't render anything if the survey isn't completed
  if (!isSurveyCompleted) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg mx-1">
      <h1 className="text-2xl font-medium">Lời cảm ơn và Giveaway</h1>
      <h2 className="text-xl font-medium">Cảm ơn bạn đã tham gia khảo sát!</h2>
      <p>
        Phản hồi của bạn là vô cùng quý báu và sẽ đóng góp thiết thực cho nghiên
        cứu của chúng tôi về thần tượng ảo.
      </p>
      <p>
        Để bày tỏ lòng biết ơn, chúng tôi tổ chức giveaway các giải thưởng vô
        cùng hấp dẫn dành cho các bạn may mắn đã hoàn thành khảo sát.
      </p>
      <p>
        Bạn vui lòng để lại số điện thoại để chúng mình có thể liên hệ trao
        thưởng nếu bạn trúng giải nhé!
      </p>
      <p className="font-medium text-xl">Giải thưởng bao gồm</p>
      <div className="text-xl">
        <ul>
          <li>
            {" "}
            <p className="text-bold">
              🎧 01 giải nhất gồm 1 combo (Tai nghe Bluetooth Lenovo TH10 + tai
              nghe thinkplus) xịn sò trị giá hơn 500🐠
            </p>
          </li>
          <li>
            {" "}
            <p>
              🎬 01 giải nhì gồm 02 vé xem phim (trị giá tối đa 220🐠/2 vé) (bạn
              được tự do chọn phim và cụm rạp)
            </p>
          </li>
          <li>
            {" "}
            <p>
              ☕ 03 giải ba, mỗi giải gồm 01 ly trà sữa (trị giá tối đa 70🐠/1
              ly)
            </p>
          </li>
        </ul>
        <p>
          <b>Lưu ý:</b> Mỗi sđt được tham gia 1 lần. Mọi thông tin được cung cấp
          sẽ được giữ bí mật và chỉ sử dụng cho mục đích nghiên cứu học thuật.
          Rất mong nhận được sự tham gia của bạn!
        </p>
      </div>
      <div className="mt-4 font-medium text-2xl flex flex-col">
        <p className="text-xl font-normal">
          Sau khi hoàn thành xong khảo sát, bạn hãy chụp lại màn hình và điền
          vào Form dưới này nhé. Hãy giữ liên lạc để có cơ hội nhận các phần quà
          hấp dẫn từ team chúng mình
        </p>
        <a
          href="https://forms.gle/WPmhbaCj8bhaseaB8"
          className="mx-auto"
          target="_blank"
        >
          👉 Link ngay đây nè 👈
        </a>
        {/* <EndSectionPhoneForm /> */}
      </div>
    </div>
  );
};

export default EndSection;
