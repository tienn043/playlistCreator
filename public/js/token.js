//http://localhost:5500/webapp/playlist-creator.html#access_token=BQC3MRSmqGGh7F2J0l7WrkyC-GLZYlo2PllpZTn-q1uWKMpl2vODg36GlPU21OdrFcFXYH5kpFmMxMpJBTc_2x7twEk_F819u4aSrHMnvwjSkqduAylAmvLTLM_3XqignPtU7ab8H9OtAWvDJHpKa_065LOE09fHmUK4miTFDdL5lALyX0FRSbw2viSqPeEcQcl2y9GTq62HOk4hnd5cu0lc_2UbZNyc&token_type=Bearer&expires_in=3600


//creates authorization object



//const{access_token, expires_in, token_type} = authObj();
//adding authorization items to local storage
localStorage.clear();
localStorage.setItem("accessToken", authObj().access_token);
localStorage.setItem("client", authObj().axpires_in);





