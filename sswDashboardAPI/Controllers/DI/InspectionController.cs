using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using sswDashboardAPI.Data;
using sswDashboardAPI.Model.DI;
using System.Data;

namespace sswDashboardAPI.Controllers.DI
{
    [Route("api/[controller]")]
    [ApiController]
    public class InspectionController : ControllerBase
    {
        private readonly string KineticConnectionString;
        private readonly string PlutoConnectionString;

        public InspectionController(IConfiguration configuration, AppDbContext context)
        {
            KineticConnectionString = configuration.GetConnectionString("KineticConnection");
            PlutoConnectionString = configuration.GetConnectionString("PlutoConnection");
        }

        [HttpPost("getpartnumber")]
        public async Task<IActionResult> GetPartNumber([FromBody] PartNumberRequest request)
        {
            string partNumber = string.Empty;
            string co = request.CountryCode == "INDIA" ? "SN" : "SSW";

            using (SqlConnection conn = new SqlConnection(KineticConnectionString))
            {
                string sql = "";

                SqlCommand cmd = new SqlCommand();
                cmd.Connection = conn;

                if (request.JobType.ToLower().Contains("job"))
                {
                    if (request.AssemblySeq == 0)
                    {
                        sql = "SELECT partnum FROM jobhead WHERE jobnum = @jobnum AND Company = @co";
                        cmd.CommandText = sql;
                        cmd.Parameters.AddWithValue("@jobnum", request.JobNum);
                        cmd.Parameters.AddWithValue("@co", co);
                    }
                    else
                    {
                        sql = "SELECT PartNum FROM JobAsmbl WHERE jobnum = @jobnum AND Assemblyseq = @seq AND Company = @co";
                        cmd.CommandText = sql;
                        cmd.Parameters.AddWithValue("@jobnum", request.JobNum);
                        cmd.Parameters.AddWithValue("@seq", request.AssemblySeq);
                        cmd.Parameters.AddWithValue("@co", co);
                    }
                }
                else if (request.JobType.ToLower().Contains("line"))
                {
                    int splitIndex = request.JobNum.IndexOf('\\');
                    if (splitIndex < 0)
                        return BadRequest("Invalid job number format. Expected 'PO\\Line'.");

                    string poNum = request.JobNum.Substring(0, splitIndex);
                    string lineNum = request.JobNum.Substring(splitIndex + 1);

                    sql = "SELECT partnum FROM podetail WHERE poNum = @poNum AND POLine = @poLine AND Company = @co";
                    cmd.CommandText = sql;
                    cmd.Parameters.AddWithValue("@poNum", poNum);
                    cmd.Parameters.AddWithValue("@poLine", lineNum);
                    cmd.Parameters.AddWithValue("@co", co);
                }
                else
                {
                    return BadRequest("Unrecognized job type.");
                }

                try
                {
                    await conn.OpenAsync();
                    var reader = await cmd.ExecuteReaderAsync(System.Data.CommandBehavior.SingleRow);
                    if (await reader.ReadAsync())
                    {
                        partNumber = reader["partnum"]?.ToString() ?? "";
                    }
                    reader.Close();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, ex.Message);
                }


            }
            return Ok($"{partNumber}");
        }

        [HttpPost("mafiatable")]
        public async Task<IActionResult> GetMafiaTable([FromBody] MafiaTableQueryDto query)
        {
            var dataTable = new DataTable();

            try
            {
                using (var conn = new SqlConnection(PlutoConnectionString))
                using (var cmd = new SqlCommand(@"SELECT * FROM MafiaTables 
                                   WHERE Partnum = @partnum AND Rev = @RevMajor AND RevMinor = @RevMinor 
                                   ORDER BY DnaNum", conn))
                {
                    cmd.Parameters.AddWithValue("@partnum", query.Partnumber);
                    cmd.Parameters.AddWithValue("@RevMajor", query.Major);
                    cmd.Parameters.AddWithValue("@RevMinor", query.Minor);

                    using (var adapter = new SqlDataAdapter(cmd))
                    {
                        await Task.Run(() => adapter.Fill(dataTable));
                    }
                }

                var result = DataTableToList(dataTable);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        public static List<Dictionary<string, object>> DataTableToList(DataTable dt)
        {
            var columns = dt.Columns.Cast<DataColumn>();
            var list = new List<Dictionary<string, object>>();

            foreach (DataRow row in dt.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (var col in columns)
                {
                    dict[col.ColumnName] = row[col];
                }
                list.Add(dict);
            }
            return list;
        }



        [HttpPost("count-of-entries")]
        public async Task<IActionResult> GetCountOfEntriesPerDNA([FromBody] CountEntriesRequestDto request)
        {
            int counter = 0;

            try
            {
                using (var conn = new SqlConnection(PlutoConnectionString))
                {
                    // You will need to replicate this C# version of VantageDB.GetOrigPartNum()
                    string origPartNum = request.PartNum;

                    string sql;
                    if (origPartNum.Trim().ToUpper() == request.PartNum.Trim().ToUpper())
                    {
                        sql = @"SELECT COUNT(cellnum) 
                        FROM MafiaEntries 
                        WHERE jobnum=@jobnum AND dnanum=@dnanum AND revmajor=@revmajor 
                              AND revminor=@revminor AND wavenumber=@wavenumber 
                              AND assemblyseq=@seq AND lot=@lotnum AND partnum IS NULL;";
                    }
                    else
                    {
                        sql = @"SELECT COUNT(cellnum) 
                        FROM MafiaEntries 
                        WHERE jobnum=@jobnum AND dnanum=@dnanum AND revmajor=@revmajor 
                              AND revminor=@revminor AND wavenumber=@wavenumber 
                              AND assemblyseq=@seq AND lot=@lotnum AND partnum=@partnum;";
                    }

                    using (var cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@jobnum", request.JobNum);
                        cmd.Parameters.AddWithValue("@dnanum", request.DnaNum.Replace("!", "").Trim());
                        cmd.Parameters.AddWithValue("@revmajor", request.RevMajor);
                        cmd.Parameters.AddWithValue("@revminor", request.RevMinor);
                        cmd.Parameters.AddWithValue("@wavenumber", request.WaveNumber);
                        cmd.Parameters.AddWithValue("@seq", request.Seq);
                        cmd.Parameters.AddWithValue("@lotnum", request.LotNum);
                        cmd.Parameters.AddWithValue("@partnum", request.PartNum);

                        await conn.OpenAsync();
                        var result = await cmd.ExecuteScalarAsync();
                        counter = Convert.ToInt32(result);
                    }
                }

                return Ok(counter); // Returns count as JSON integer
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("mafia-entry-table")]
        public async Task<IActionResult> GetMafiaEntryTable([FromBody] CountEntriesRequestDto request)
        {
            var dataTable = new DataTable();

            try
            {
                // Clean DNA number
                var dnaNumber = request.DnaNum?.Replace("!", "").Trim();

                // Use helper method to get original part number
                string origPartNum = request.PartNum;

                using (var conn = new SqlConnection(PlutoConnectionString))
                using (var cmd = new SqlCommand())
                {
                    cmd.Connection = conn;

                    if (origPartNum.Trim().ToUpper() == request.PartNum.Trim().ToUpper())
                    {
                        cmd.CommandText = @"SELECT * FROM MafiaEntries 
                                    WHERE Jobnum=@jobnum AND dnanum=@dnanumber AND Revmajor=@RevMajor 
                                          AND RevMinor=@revminor AND WaveNumber=@WaveNumber AND assemblySeq=@seq 
                                          AND partNum IS NULL AND lot=@lotnum 
                                    ORDER BY CellNum";
                    }
                    else
                    {
                        cmd.CommandText = @"SELECT * FROM MafiaEntries 
                                    WHERE Jobnum=@jobnum AND dnanum=@dnanumber AND Revmajor=@RevMajor 
                                          AND RevMinor=@revminor AND WaveNumber=@WaveNumber AND assemblySeq=@seq 
                                          AND partNum=@partNum AND lot=@lotnum 
                                    ORDER BY CellNum";
                    }

                    cmd.Parameters.AddWithValue("@jobnum", request.JobNum);
                    cmd.Parameters.AddWithValue("@dnanumber", dnaNumber);
                    cmd.Parameters.AddWithValue("@RevMajor", request.RevMajor);
                    cmd.Parameters.AddWithValue("@revminor", request.RevMinor);
                    cmd.Parameters.AddWithValue("@WaveNumber", request.WaveNumber);
                    cmd.Parameters.AddWithValue("@seq", request.Seq);
                    cmd.Parameters.AddWithValue("@partNum", request.PartNum);
                    cmd.Parameters.AddWithValue("@lotnum", request.LotNum);

                    using (var adapter = new SqlDataAdapter(cmd))
                    {
                        await Task.Run(() => adapter.Fill(dataTable));
                    }
                }

                var result = DataTableToList(dataTable);

                return Ok(result); // Return full table as JSON
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("original-quantity")]
        public async Task<IActionResult> GetOriginalQuantity([FromBody] OriginalQuantityRequestDto request)
        {
            if (request == null)
            {
                return BadRequest(new { message = "Request payload is missing or malformed." });
            }

            int originalQuantity = 0;

            try
            {
                string origPartNum = request.PartNum?.Trim().ToUpper();
                string inputPartNum = request.PartNum?.Trim().ToUpper();

                using var conn = new SqlConnection(PlutoConnectionString);
                using var cmd = new SqlCommand();
                cmd.Connection = conn;

                // Use partnum IS NULL when it's not specified (or empty string)
                bool isPartNumEmpty = string.IsNullOrWhiteSpace(request.PartNum);

                if (isPartNumEmpty || origPartNum == inputPartNum)
                {
                    cmd.CommandText = @"
                        SELECT OrigQuan 
                        FROM MafiaJobHeader 
                        WHERE jobnum = @jobnum 
                            AND WaveNumber = @WaveNumber 
                            AND assemblyseq = @seq 
                            AND partnum IS NULL 
                            AND lot = @lot;";
                }
                else
                {
                    cmd.CommandText = @"
                        SELECT OrigQuan 
                        FROM MafiaJobHeader 
                        WHERE jobnum = @jobnum 
                            AND WaveNumber = @WaveNumber 
                            AND assemblyseq = @seq 
                            AND partnum = @partnum 
                            AND lot = @lot;";
                }

                cmd.Parameters.AddWithValue("@jobnum", request.JobNum ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@WaveNumber", request.WaveNumber);
                cmd.Parameters.AddWithValue("@seq", request.Seq);
                cmd.Parameters.AddWithValue("@lot", request.Lot);

                if (!isPartNumEmpty && cmd.CommandText.Contains("@partnum"))
                {
                    cmd.Parameters.AddWithValue("@partnum", request.PartNum);
                }

                await conn.OpenAsync();
                var result = await cmd.ExecuteScalarAsync();

                if (result != null && result != DBNull.Value)
                {
                    originalQuantity = Convert.ToInt32(result);
                }

                return Ok(originalQuantity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpPost("comment")]
        public async Task<IActionResult> GetComment([FromBody] CountEntriesRequestDto request)
        {
            string comment = string.Empty;

            try
            {
                string dnaNumber = request.DnaNum?.Replace("!", "").Trim();
                string origPartNum = request.PartNum;

                using (var conn = new SqlConnection(PlutoConnectionString))
                using (var cmd = new SqlCommand())
                {
                    cmd.Connection = conn;

                    if (origPartNum.Trim().ToUpper() == request.PartNum.Trim().ToUpper())
                    {
                        cmd.CommandText = @"SELECT Comment FROM MafiaEntriesComments 
                                    WHERE JobNum=@JobNum AND DNANum=@DNANum AND RevMajor=@RevMajor 
                                          AND RevMinor=@RevMinor AND WaveNumber=@WaveNumber 
                                          AND assemblySeq=@seq AND partnum IS NULL AND lot=@lotnum;";
                    }
                    else
                    {
                        cmd.CommandText = @"SELECT Comment FROM MafiaEntriesComments 
                                    WHERE JobNum=@JobNum AND DNANum=@DNANum AND RevMajor=@RevMajor 
                                          AND RevMinor=@RevMinor AND WaveNumber=@WaveNumber 
                                          AND assemblySeq=@seq AND partnum=@partnum AND lot=@lotnum;";
                    }

                    cmd.Parameters.AddWithValue("@JobNum", request.JobNum);
                    cmd.Parameters.AddWithValue("@DNANum", dnaNumber);
                    cmd.Parameters.AddWithValue("@RevMajor", request.RevMajor);
                    cmd.Parameters.AddWithValue("@RevMinor", request.RevMinor);
                    cmd.Parameters.AddWithValue("@WaveNumber", request.WaveNumber);
                    cmd.Parameters.AddWithValue("@seq", request.Seq);
                    cmd.Parameters.AddWithValue("@partnum", request.PartNum);
                    cmd.Parameters.AddWithValue("@lotnum", request.LotNum);

                    await conn.OpenAsync();

                    var result = await cmd.ExecuteScalarAsync();
                    if (result != null && result != DBNull.Value)
                        comment = result.ToString();
                    else
                        comment = "NULL"; // match your VB.NET fallback behavior
                }

                return Ok(comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("determine-multiplier")]
        public async Task<IActionResult> DetermineMultiplier([FromBody] DetermineMultiplierRequestDto request)
        {
            double multiplier = 0;

            try
            {
                string dimType = request.DimType;
                string toleranceClass = request.ToleranceClass?.Trim().ToLower();
                double jobQuan = request.JobQuan;

                if (dimType?.ToLower().Contains("diameter") == true)
                {
                    dimType = "Diameter";
                }

                // Special tolerance cases — immediate return
                if (toleranceClass == "very coarse")
                    return Ok(2 / jobQuan);

                if (toleranceClass.Contains("programming"))
                    return Ok(1 / jobQuan);

                if (toleranceClass.Contains("first"))
                    return Ok(0);

                if (request.ToleranceClass.Contains("100%"))
                    return Ok(1);

                // Determine quantity range
                string quanRange = jobQuan switch
                {
                    < 26 => "0-25",
                    < 76 => "26-75",
                    < 151 => "76-150",
                    < 251 => "151-250",
                    < 501 => "251-500",
                    < 751 => "501-750",
                    < 1001 => "751-1000",
                    < 1501 => "1001-1500",
                    < 2001 => "1501-2000",
                    < 3001 => "2001-3000",
                    < 5001 => "3001-5000",
                    _ => ">5000"
                };

                using (var conn = new SqlConnection(PlutoConnectionString))
                using (var cmd = new SqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"SELECT Multiplier FROM MafiaToleranceQuantity 
                                WHERE Type=@Type AND Quan=@Quan AND Class=@Class";

                    cmd.Parameters.AddWithValue("@Type", dimType);
                    cmd.Parameters.AddWithValue("@Quan", quanRange);
                    cmd.Parameters.AddWithValue("@Class", request.ToleranceClass);

                    await conn.OpenAsync();
                    var result = await cmd.ExecuteScalarAsync();

                    multiplier = (result != null && result != DBNull.Value)
                        ? Convert.ToDouble(result)
                        : 0;
                }

                return Ok(multiplier);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("latest-major-revision")]
        public async Task<IActionResult> GetLatestMajorRevision([FromQuery] string partNum)
        {
            int latestRevision = 0;

            try
            {
                using (var conn = new SqlConnection(PlutoConnectionString))
                using (var cmd = new SqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"SELECT MAX(Rev) AS major FROM MafiaTables 
                                WHERE partnum = @partnum AND released = 1";

                    cmd.Parameters.AddWithValue("@partnum", partNum);

                    await conn.OpenAsync();
                    var result = await cmd.ExecuteScalarAsync();

                    if (result != null && result != DBNull.Value)
                    {
                        latestRevision = Convert.ToInt32(result);
                    }
                }

                return Ok(latestRevision);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet("latest-minor-revision")]
        public async Task<IActionResult> GetLatestMinorRevision([FromQuery] string partNum, [FromQuery] int major)
        {
            int latestMinorRevision = 0;

            try
            {
                using (var conn = new SqlConnection(PlutoConnectionString))
                using (var cmd = new SqlCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandText = @"
                            SELECT MAX(RevMinor) AS minor
                            FROM MafiaTables
                            WHERE partnum = @partnum AND Rev = @major AND released = 1";

                    cmd.Parameters.AddWithValue("@partnum", partNum);
                    cmd.Parameters.AddWithValue("@major", major);

                    await conn.OpenAsync();
                    var result = await cmd.ExecuteScalarAsync();

                    if (result != null && result != DBNull.Value)
                    {
                        latestMinorRevision = Convert.ToInt32(result);
                    }
                }

                return Ok(latestMinorRevision);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpPost("save-inspection")]
        public async Task<IActionResult> SaveInspectionAsync([FromBody] SaveInspectionEntriesRequestDto dto)
        {
            int insertedCount = 0;

            try
            {
                using var conn = new SqlConnection(PlutoConnectionString);
                await conn.OpenAsync();

                // Step 1: Validation — ensure no conflict with existing entries
                string partCheckSql = dto.PartNum.Trim().ToUpper() == dto.PartNum.Trim().ToUpper()
                    ? "SELECT COUNT(cellnum) FROM MafiaEntries WHERE jobnum=@jobnum AND dnanum=@dnanum AND revmajor=@revmajor AND revminor=@revminor AND wavenumber=@wavenumber AND assemblyseq=@seq AND lot=@lotnum AND partnum IS NULL;"
                    : "SELECT COUNT(cellnum) FROM MafiaEntries WHERE jobnum=@jobnum AND dnanum=@dnanum AND revmajor=@revmajor AND revminor=@revminor AND wavenumber=@wavenumber AND assemblyseq=@seq AND lot=@lotnum AND partnum=@partnum;";

                using (var countCmd = new SqlCommand(partCheckSql, conn))
                {
                    countCmd.Parameters.AddWithValue("@jobnum", dto.JobNum);
                    countCmd.Parameters.AddWithValue("@dnanum", dto.DnaNum.Replace("!", "").Trim());
                    countCmd.Parameters.AddWithValue("@revmajor", dto.RevMajor);
                    countCmd.Parameters.AddWithValue("@revminor", dto.RevMinor);
                    countCmd.Parameters.AddWithValue("@wavenumber", dto.WaveNumber);
                    countCmd.Parameters.AddWithValue("@seq", dto.AssemblySeq);
                    countCmd.Parameters.AddWithValue("@lotnum", dto.LotNum);
                    countCmd.Parameters.AddWithValue("@partnum", dto.PartNum);

                    var existing = await countCmd.ExecuteScalarAsync();
                    if (Convert.ToInt32(existing) > 0)
                        return Conflict("Data conflict: Entries already exist. Please refresh.");
                }

                // Step 2: Insert entries
                foreach (var kvp in dto.Entries)
                {
                    if (string.IsNullOrWhiteSpace(kvp.Value)) continue;

                    int cellNum = int.Parse(kvp.Key.Replace("txtDynamic", ""));
                    string pieceNum = cellNum > 100000 ? cellNum.ToString() : (100000 + cellNum).ToString();

                    // Normalize value like legacy did ("p" -> -777, "f" -> -999)
                    string value = kvp.Value.Trim().ToLower() switch
                    {
                        "p" => "-777",
                        "f" => "-999",
                        _ => kvp.Value.Trim()
                    };

                  

                    bool isNonconforming = dto.NonConformities != null &&
                                           dto.NonConformities.CellNums.Contains(cellNum);

                    string insertSql = @"
                        INSERT INTO MafiaEntries 
                        (JobNum, DNANum, RevMinor, RevMajor, CellNum, EnteredBy, EnteredTime, WaveNumber, Value, Tool, pieceNumber, AssemblySeq, PartNum, Lot, NonComformityClassification, Scrap, Leave, Dmr)
                        VALUES 
                        (@jobnum, @dnanum, @revminor, @revmajor, @cellnum, @enteredby, @enteredtime, @wavenumber, @value, @tool, @piecenum, @seq, @partnum, @lotnum, @classification, @scrap, @leave, @dmr);";

                    using var insertCmd = new SqlCommand(insertSql, conn);
                    insertCmd.Parameters.AddWithValue("@jobnum", dto.JobNum);
                    insertCmd.Parameters.AddWithValue("@dnanum", dto.DnaNum.Replace("!", "").Trim());
                    insertCmd.Parameters.AddWithValue("@revminor", dto.RevMinor);
                    insertCmd.Parameters.AddWithValue("@revmajor", dto.RevMajor);
                    insertCmd.Parameters.AddWithValue("@cellnum", cellNum);
                    insertCmd.Parameters.AddWithValue("@enteredby", dto.EnteredBy);
                    insertCmd.Parameters.AddWithValue("@enteredtime", DateTime.Now);
                    insertCmd.Parameters.AddWithValue("@wavenumber", dto.WaveNumber);
                    insertCmd.Parameters.AddWithValue("@value", value);
                    insertCmd.Parameters.AddWithValue("@tool", dto.Tool ?? "");
                    insertCmd.Parameters.AddWithValue("@piecenum", pieceNum);
                    insertCmd.Parameters.AddWithValue("@seq", dto.AssemblySeq);

                    // Handle partnum logic as legacy: if same as original, NULL; else keep
                    insertCmd.Parameters.AddWithValue("@partnum", dto.PartNum);
                    insertCmd.Parameters.AddWithValue("@lotnum", dto.LotNum);

                    // Nonconformity fields (conditionally applied per cell)
                    insertCmd.Parameters.AddWithValue("@classification",
                        isNonconforming && !string.IsNullOrWhiteSpace(dto.NonConformities.Classification)
                            ? dto.NonConformities.Classification
                            : DBNull.Value as object);

                    insertCmd.Parameters.AddWithValue("@scrap", isNonconforming && dto.NonConformities.Scrap);
                    insertCmd.Parameters.AddWithValue("@leave", isNonconforming && dto.NonConformities.Leave);
                    insertCmd.Parameters.AddWithValue("@dmr", isNonconforming && dto.NonConformities.Dmr);

                    insertedCount += await insertCmd.ExecuteNonQueryAsync();
                }


                // Step 3: Insert/update comment
                if (dto.RevMinor != -1 && !string.IsNullOrWhiteSpace(dto.Comment))
                {
                    string checkCommentSql = dto.PartNum.Trim().ToUpper() == dto.PartNum.Trim().ToUpper()
                        ? "SELECT Comment FROM MafiaEntriesComments WHERE JobNum=@jobnum AND DNANum=@dnanum AND RevMajor=@revmajor AND RevMinor=@revminor AND WaveNumber=@wavenumber AND AssemblySeq=@seq AND PartNum IS NULL AND Lot=@lotnum;"
                        : "SELECT Comment FROM MafiaEntriesComments WHERE JobNum=@jobnum AND DNANum=@dnanum AND RevMajor=@revmajor AND RevMinor=@revminor AND WaveNumber=@wavenumber AND AssemblySeq=@seq AND PartNum=@partnum AND Lot=@lotnum;";

                    using var checkCmd = new SqlCommand(checkCommentSql, conn);
                    checkCmd.Parameters.AddWithValue("@jobnum", dto.JobNum);
                    checkCmd.Parameters.AddWithValue("@dnanum", dto.DnaNum.Replace("!", "").Trim());
                    checkCmd.Parameters.AddWithValue("@revmajor", dto.RevMajor);
                    checkCmd.Parameters.AddWithValue("@revminor", dto.RevMinor);
                    checkCmd.Parameters.AddWithValue("@wavenumber", dto.WaveNumber);
                    checkCmd.Parameters.AddWithValue("@seq", dto.AssemblySeq);
                    checkCmd.Parameters.AddWithValue("@partnum", dto.PartNum);
                    checkCmd.Parameters.AddWithValue("@lotnum", dto.LotNum);

                    var commentResult = await checkCmd.ExecuteScalarAsync();

                    string commentSql = (commentResult == null || commentResult == DBNull.Value)
                        ? "INSERT INTO MafiaEntriesComments (JobNum, DNANum, RevMajor, RevMinor, WaveNumber, Comment, EnteredTime, AssemblySeq, PartNum, Lot) VALUES (@jobnum, @dnanum, @revmajor, @revminor, @wavenumber, @comment, @enteredTime, @seq, @partnum, @lotnum);"
                        : "UPDATE MafiaEntriesComments SET Comment=@comment, EnteredTime=@enteredTime WHERE JobNum=@jobnum AND DNANum=@dnanum AND RevMajor=@revmajor AND RevMinor=@revminor AND WaveNumber=@wavenumber AND AssemblySeq=@seq AND PartNum=@partnum AND Lot=@lotnum;";

                    using var commentCmd = new SqlCommand(commentSql, conn);
                    commentCmd.Parameters.AddWithValue("@jobnum", dto.JobNum);
                    commentCmd.Parameters.AddWithValue("@dnanum", dto.DnaNum.Replace("!", "").Trim());
                    commentCmd.Parameters.AddWithValue("@revmajor", dto.RevMajor);
                    commentCmd.Parameters.AddWithValue("@revminor", dto.RevMinor);
                    commentCmd.Parameters.AddWithValue("@wavenumber", dto.WaveNumber);
                    commentCmd.Parameters.AddWithValue("@comment", dto.Comment);
                    commentCmd.Parameters.AddWithValue("@enteredTime", DateTime.Now);
                    commentCmd.Parameters.AddWithValue("@seq", dto.AssemblySeq);
                    commentCmd.Parameters.AddWithValue("@partnum", string.IsNullOrWhiteSpace(dto.PartNum) ? DBNull.Value : dto.PartNum);
                    commentCmd.Parameters.AddWithValue("@lotnum", dto.LotNum);

                    await commentCmd.ExecuteNonQueryAsync();
                }

                return Ok(new { inserted = insertedCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message,
                    stackTrace = ex.StackTrace,
                    sql = ex.InnerException?.Message
                });
            }
        }

        [HttpPost("determine-number-to-check")]
        public async Task<IActionResult> DetermineNumberToCheck([FromBody] DetermineCheckCountRequestDto request)
        {
            try
            {
                var mafiaTableRequest = new MafiaTableQueryDto
                {
                    Partnumber = request.PartNum,
                    Major = request.RevMajor,
                    Minor = request.RevMinor
                };

                var mafiaTableResult = await GetMafiaTable(mafiaTableRequest) as OkObjectResult;
                if (mafiaTableResult?.Value is not List<Dictionary<string, object>> mafiaRows)
                    return StatusCode(500, "Failed to retrieve Mafia Table");

                foreach (var row in mafiaRows)
                {
                    if (row["DNANum"].ToString() == request.DnaNum)
                    {
                        string tolClass = row["ToleranceClass"]?.ToString()?.Trim().ToLower();
                        string dimType = row["DimType"]?.ToString();

                        if (tolClass == "100%")
                            return Ok((int)request.JobQuan);

                        if (tolClass == "first piece only")
                            return Ok(1);

                        var multiplierRequest = new DetermineMultiplierRequestDto
                        {
                            DimType = dimType,
                            ToleranceClass = row["ToleranceClass"].ToString(),
                            JobQuan = request.JobQuan
                        };

                        var multiplierResult = await DetermineMultiplier(multiplierRequest) as OkObjectResult;
                        double multiplier = multiplierResult != null ? Convert.ToDouble(multiplierResult.Value) : 0;

                        if (multiplier == 0)
                            return Ok(0);

                        int result = (int)Math.Ceiling(request.JobQuan * multiplier);
                        return Ok(multiplier == 1 ? result : result + 2);
                    }
                }

                return Ok(0); // No matching DNANum found
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpPost("determine-number-to-check-additional")]
        public async Task<IActionResult> DetermineNumberToCheckAddl([FromBody] CountEntriesRequestDto request)
        {
            try
            {
                // 1. Get count of existing entries from DB
                var countResult = await GetCountOfEntriesPerDNA(request) as OkObjectResult;
                int existingCount = countResult != null ? Convert.ToInt32(countResult.Value) : 0;

                // 2. Fetch matching mafia table rows
                var mafiaTableRequest = new MafiaTableQueryDto
                {
                    Partnumber = request.PartNum,
                    Major = request.RevMajor,
                    Minor = request.RevMinor
                };

                var mafiaTableResult = await GetMafiaTable(mafiaTableRequest) as OkObjectResult;
                if (mafiaTableResult?.Value is not List<Dictionary<string, object>> mafiaRows)
                    return StatusCode(500, "Failed to retrieve Mafia Table");

                int result = 0;
                double multiplier = 0;

                foreach (var row in mafiaRows)
                {
                    if (row["DNANum"].ToString() == request.DnaNum)
                    {
                        string tolClass = row["ToleranceClass"]?.ToString()?.Trim().ToLower();
                        string dimType = row["DimType"]?.ToString();

                        if (tolClass == "100%")
                        {
                            result = (int)request.JobQuan;
                            multiplier = 1;
                            break;
                        }

                        if (tolClass == "first piece only")
                        {
                            result = 1;
                            multiplier = 1;
                            break;
                        }

                        var multiplierRequest = new DetermineMultiplierRequestDto
                        {
                            DimType = dimType,
                            ToleranceClass = row["ToleranceClass"].ToString(),
                            JobQuan = request.JobQuan
                        };

                        var multiplierResult = await DetermineMultiplier(multiplierRequest) as OkObjectResult;
                        multiplier = multiplierResult != null ? Convert.ToDouble(multiplierResult.Value) : 0;

                        result = multiplier == 0 ? 0 : (int)Math.Ceiling(request.JobQuan * multiplier);
                        break;
                    }
                }

                return Ok(existingCount > result ? existingCount : 0);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


    }

}
